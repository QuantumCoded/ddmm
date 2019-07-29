const settings = require('../utility/settings');
const logger = require('../utility/logger');
const WebhookMessage = require('../utility/webhook-message');
const assets = require('../assets');
const relay = require('../relay');

module.exports = function(message) {
  const client = require('../index');

  let operators = settings.getValue('operators'); // Get the operators out of settings
  let guildId = settings.getValue('guild-id'); // Get the guild id out of settings
  let type;

  // Validate that the guild exists
  if (!client.guilds.has(guildId)) return;

  // NTS: const startsWithOperator = Object.values(operators).some((operator) => msg.channel.startsWith(operator));

  // Create a flag for important characteristics or each message
  let isChannelRelayable = client.channels.has(message.channel.id) && relay.channelRelays.has(message.channel.id); // Was the message sent in a relayable guild channel
  let isIncoming = message.channel.type == 'dm' && client.user.id != message.author.id;                            // Was the message sent in a dm channel by another user
  let isInternal = message.guild && message.guild.id == guildId;                                                   // Was the message sent in the guild
  let isCommand = isInternal && message.content.startsWith(operators.command);                                     // Was the message internal and using the command operator
  let isNote = isInternal && message.content.startsWith(operators.note);                                           // Was the message internal and using the note operator
  let isRelayable = !message.author.bot && !(isCommand || isNote) && isChannelRelayable;                           // Was the message in a relayabe channel and a valid relayable message

  // A code that represents the state of all the conditions above
  let typeCode = (isChannelRelayable << 5) +
                 (isIncoming         << 4) +
                 (isInternal         << 3) +
                 (isCommand          << 2) +
                 (isNote             << 1) +
                 (isRelayable        << 0);

  

  // Type the message
  if (isIncoming) type = 'incoming';   // If the message was sent by another user in a dms channel then it's an incomming message
  if (isRelayable) type = 'relayable'; // If the message was sent in a dms guild channel and is valid then it's a relayable message
  if (isCommand) type = 'command';     // If the message was sent in the dms guild and is a valid command it's a command message
  if (isNote) type = 'note';           // If the message was sent in the dms guild and is a valid note it's a note message

  // If the message is valid then handle it
  if (type) logger.debug(`Processing a message of type ${type} (${typeCode})`);

  switch(type) {
    // If the message is a command execute the command
    case 'command':
      logger.debug(`Parsing command from message ${message.content}`);
      let command = message.content.split(' ').shift(); // Get the first block of the string
      let commandOperator = settings.getValue('operators').command; // Get the command operator
      let name = command.replace(commandOperator, ''); // Remove the command operator from the string

      logger.debug(`Running command ${name}`);
      assets.runCommand(name, message); // Run the command
    break;
    
    // If the message is a note send a webhook message
    case 'note':
      logger.debug(`Creating a note from message ${message.content}`);
      logger.debug(`Getting operators from settings`);
      let noteOperator = settings.getValue('operators').note; // Get the note operator from the client's setings
      let note = message.content.replace(noteOperator, '').trim();

      logger.debug(`Deleting the client's original message`);
      message.delete().catch(logger.error); // Delete the client's message

      // Send a note containing the message's content in the channel
      logger.debug(`Sending the client's note message`);
      new WebhookMessage(message.channel, assets.getTemplate('note', note));
    break;
    
    // If the message is an incoming dm message handle sending the message
    case 'incoming':
      // If the user has a relay then send a message otherwise create a channel
      logger.debug('Checking if the user has a relay');
      if (relay.userRelays.has(message.author.id)) {
        let user = relay.userRelays.get(message.author.id); // Get the relay for the user

        // Validate the map integrity
        if (!client.channels.has(user.channel.id) || !client.channels.has(user.dms.id)) {
          // NTS: Add the ability to disable the auto reconstruct

          relay.initialize();
          relay.createRelay(message.author, message);
          return;
        }

        logger.debug('Sending a message to the channel');
        new WebhookMessage(user.channel, assets.getTemplate('message', message)); // Send a message to the user's channel
      } else {
        // Create a new relay for the user
        logger.debug('The user doesn\'t have a relay creating a new one');
        relay.createRelay(message.author, message);
      }
    break;

    // If the message is a relayable message in a valid channel
    case 'relayable':
      // If the channel has a relay then send the message
      logger.debug('Checking if the channel has a relay');
      if (relay.channelRelays.has(message.channel.id)) {
        let user = relay.channelRelays.get(message.channel.id); // Get the relay for the channel

        logger.debug('Relaying the message to the user');
        user.dms.send(message.content, {files: Array.from(message.attachments.values()).map(a => a.url)}); // Send a message to the user
      } else {
        logger.warn(`Unable to find the channel relay for ${message.channel.id}`);
        relay.initialize();
      }
    break;
  }

  logger.silly(`Recieved a message with type code ${typeCode}`);
};