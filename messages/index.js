const ddmm = require('ddmm');

const fs = require('fs');
const path = require('path');

const webhook = require('./webhook');

const assetsPath = path.join(__dirname, 'assets');

const templates = new Map(); // Map<templateName, templateConstructor>
const reactableMap = new Map(); // Map<messageId, reactableCallback>

// NTS: This is hopefully going to changed over to using the reactionCollector.on('remove')
  //    However the login problem with discord.js master must be resolved first

// Construct and send a message using the webhook module
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

// Load the message templates so they're ready to use
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

// Handles unreacting to messages
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

// Sets up the handlers to make a message a reactable message
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