/**
 * Messages module
 * @module ddmm/messages
 * @requires ddmm/messages/webhook
 */

const ddmm = require('ddmm');
const Djs = require('discord.js');

const Message = Djs.Message;
const TextChannel = Djs.TextChannel;
const Emoji = Djs.Emoji;
const MessageReaction = Djs.MessageReaction;
const User = Djs.User;

const fs = require('fs');
const path = require('path');

const webhook = require('./webhook');

const assetsPath = path.join(__dirname, 'assets');

const templates = new Map(); // Map<templateName, templateConstructor>
const reactableMap = new Map(); // Map<messageId, reactableCallback>

// NTS: This is hopefully going to changed over to using the reactionCollector.on('remove')
  //    However the login problem with discord.js master must be resolved first

/**
 * @callback WebhookCallback
 * @param {Message} message The message that was sent
 */

/**
 * Constructs and sends a message using the webhook module.
 * @param {TextChannel} channel The channel to send the message to
 * @param {string} name The name of the message template to use
 * @param {any} options The options to construct the template with
 * @param {WebhookCallback} callback The function to be called after the message is sent
 */
module.exports.send = function(channel, name, options, callback) {

  // If the template exists in the map
  if (templates.has(name)) 
    webhook(channel, templates.get(name)(options), callback); // Create a webhook for the message
  else
    ddmm.logger.warn(`Unknown message template ${name}`); // Otherwise throw a warning
    
    // NTS: Throw a PossibleImportMissing warning
    //    A request to access the message template "template name" has failed. It's possible that the asset is just not initialized
    //    Run !reload <msg|cmd|event|all> to re-initialize the assets that may not have been included
};

/**
 * @callback ReactableCallback
 * @param {string|number} result The result of the reactable, -1 if a timeout occured
 */

/**
 * Converts a message into a reactable message.
 * @param {Message} message The message to convert
 * @param {Emoji[]} reactions The emojis to react with
 * @param {ReactableCallback} callback Called whe the reactable gets a reaction or times out
 * @example
let emojiNames = ['xbutton','circlebutton','trianglebutton', 'squarebutton']; // The names of the emojis to send

// The emojis stored as an array
let reactions = emojiNames.map(name => {
  return [...message.guild.emojis.filter(emoji => emoji.name === name).values()][0]; // Get the first emoji with a matching name in the message's guild
});

// Send the message
ddmm.messages.send(
  message.channel,
  'reactable',
  {
    emojis: reactions,
    prompts: ['a','b','c','d']
  },

  function(message) {

    // Convert the message to a reactable message
    ddmm.messages.makeReactable(message, reactions, function(result) {

      // Handles a reaction
      switch(result) {
        case -1:
          // The reactable has timed out
        break;

        default:
          // You got a reaction
        break;
      }
    });
  }
);
 */
module.exports.makeReactable = function(message, reactions, callback) {

  ddmm.logger.debug(`Reactifying message ${message.id}`);

  // Add reaction buttons the create a reaction collector
  //   Clever solution to sequential promises, nice one css-tricks <3
  reactions.reduce( (promise, reaction) => {
    promise.catch(ddmm.logger.error);

    ddmm.logger.debug(`Adding reaction ${reaction}`);

    return promise.then(() => {
      return message.react(reaction);
    });
  }, Promise.resolve())

    // When all the reactions are sent, add the message to the reactable cache and start the timeout handler
    .then(() => {
      reactableMap.set(message.id, callback);

      // Timeout handler
      setTimeout(function() {
        if (reactableMap.has(message.id)) {
          ddmm.logger.debug(`Message ${message.id} had a reactable timeout`);

          message.clearReactions() // Remove the reactions from the reactable
            .catch(ddmm.logger.error)
            .then(() => callback(-1)); // Respond with a timeout

          reactableMap.delete(message.id); // Remove the reactable message
        }
      }, 60000);
    });
};

/**
 * Handles unreacting to a message and triggering reactable callbacks.
 * This should only be called by the messageReactionRemove event in ddmm/events/assets.
 * @param {MessageReaction} reaction The reaction that was removed
 * @param {User} user The user that unreacted
 */
module.exports.messageUnreact = function(reaction, user) {
  let client = ddmm.getClient();

  ddmm.logger.silly(`Checking if message ${reaction.message.id} is reactable`);

  // If the message is reactable and the user is the client
  if (reactableMap.has(reaction.message.id) && user.id === client.user.id) {
    let reactableCallback = reactableMap.get(reaction.message.id);

    ddmm.logger.debug(`Reaction removed from reactable ${reaction.message.id}`);

    reaction.message.clearReactions() // Remove the reactions from the reactable
      .catch(ddmm.logger.error)
      .then(() => reactableCallback(reaction.emoji.name)); // Call the handler with the reactable input
      
    reactableMap.delete(reaction.message.id); // Disable the reactable
  }
};

/**
 * Loads all the templates into a map so they're ready to use,
 * should be ran before trying to call send.
 */
module.exports.initialize = function() {
  let assets = fs.readdirSync(assetsPath);

  templates.clear(); // Remove existing message templates

  ddmm.import.messages(templates); // Import message from packages

  // Load core templates
  assets.forEach(asset => {
    let assetPath = path.join(assetsPath, asset);
    templates.set(asset.replace('.js', ''), require(assetPath));
  });
};