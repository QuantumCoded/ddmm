const ddmm = require('ddmm');

module.exports = function(message) {
  let client = ddmm.getClient();

  let operators = ddmm.settings.getValue('operators'); // Get the operators out of settings
  let guildId = ddmm.settings.getValue('guild-id');    // Get the guild id out of settings
  let type;

  // Validate that the guild exists
  if (!client.guilds.has(guildId)) return;

  // Create a flag for important characteristics or each message
  let isBotMessage = message.author.bot;                                                                                // Was the message sent by a bot account
  let isChannelRelayable = client.channels.has(message.channel.id) && ddmm.relay.channelRelays.has(message.channel.id); // Was the message sent in a relayable guild channel
  let isIncoming = message.channel.type === 'dm' && client.user.id != message.author.id;                                // Was the message sent in a dm channel by another user
  let isInternal = message.guild && message.guild.id === guildId;                                                       // Was the message sent in the guild
  let isCommand = !isBotMessage && isInternal && message.content.startsWith(operators.command);                         // Was the message internal and using the command operator
  let isNote = !isBotMessage && isInternal && message.content.startsWith(operators.note);                               // Was the message internal and using the note operator
  let isRelayable = !isBotMessage && !(isCommand || isNote) && isChannelRelayable;                                      // Was the message in a relayabe channel and a valid relayable message

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
  if (type) ddmm.logger.debug(`Processing a message of type ${type} (${typeCode})`);

  switch(type) {
    // If the message is a command execute the command
    case 'command':
      ddmm.logger.debug(`Parsing command from message ${message.content}`);
      let command = message.content.split(' ').shift(); // Get the first block of the string
      let commandOperator = ddmm.settings.getValue('operators').command; // Get the command operator
      let name = command.replace(commandOperator, ''); // Remove the command operator from the string

      ddmm.logger.debug(`Running command ${name}`);
      // assets.runCommand(name, message); // Run the command
      ddmm.commands.execute(name, message); // Run the command but better
    break;
    
    // If the message is a note send a webhook message
    case 'note':
      ddmm.logger.debug(`Creating a note from message ${message.content}`);
      ddmm.logger.debug(`Getting operators from settings`);
      let noteOperator = ddmm.settings.getValue('operators').note; // Get the note operator from the client's setings
      let note = message.content.replace(noteOperator, '').trim();

      // Delete the client's original message      
      ddmm.logger.debug(`Deleting the client's original message`);
      message.delete()
        .catch(ddmm.logger.error);

      // Send a note containing the message's content in the channel
      ddmm.logger.debug(`Sending the client's note message`);
      ddmm.messages.send(message.channel, 'note', note);
    break;
    
    // If the message is an incoming dm message handle sending the message
    case 'incoming':
      // If the user has a relay then send a message otherwise create a channel
      ddmm.logger.debug('Checking if the user has a relay');
      if (ddmm.relay.userRelays.has(message.author.id)) {
        let userRelay = ddmm.relay.userRelays.get(message.author.id); // Get the relay for the user

        // Validate the map integrity
        if (!client.channels.has(userRelay.channel.id) || !client.channels.has(userRelay.dms.id)) {
          // NTS: Add the ability to disable the auto reconstruct

          ddmm.relay.initialize();
          ddmm.relay.createRelay(message.author, message);
          return;
        }

        ddmm.logger.debug('Sending a message to the channel');
        ddmm.messages.send(userRelay.channel, 'message', message); // Send a message to the user's channel
      } else {
        // Create a new relay for the user
        ddmm.logger.debug('The user doesn\'t have a relay creating a new one');
        ddmm.relay.createRelay(message.author, message);
      }
    break;

    // If the message is a relayable message in a valid channel
    case 'relayable':
      // If the channel has a relay then send the message
      ddmm.logger.debug('Checking if the channel has a relay');
      if (ddmm.relay.channelRelays.has(message.channel.id)) {
        let userRelay = ddmm.relay.channelRelays.get(message.channel.id); // Get the relay for the channel

        ddmm.logger.debug('Relaying the message to the user');
        userRelay.dms.send(message.content, {files: Array.from(message.attachments.values()).map(a => a.url)}); // Send a message to the user
      } else {
        ddmm.logger.warn(`Unable to find the channel relay for ${message.channel.id}`);
        ddmm.relay.initialize();
      }
    break;
  }

  ddmm.logger.silly(`Recieved a message with type code ${typeCode}`);
};