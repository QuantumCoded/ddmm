const Channel = require('../channel/channel');
const Command = require('../command/command');
const MessageTemplate = require('../message/template');
const WebhookMessage = require('../webhook/message');

class Message {
  type;
  client;
  author;
  channel;
  content;

  
  constructor(type, message, client) {
    client.log.debug('Constructing a message');

    this.type = type;
    this.client = client; // Set the client value to the client
    this.author = message.author; // Set the author value to the author of the message
    this.channel = message.channel; // Set the channel value to the channel of the message
    this.content = message.content; // Set the content value to the content of the message

    // Handle the message by type
    client.log.debug(`Handling the message type ${type}`);
    switch(type) {
      // If the message is a command execute the command
      case 'command':
        client.log.debug(`Running command from message ${message.content}`);
        Command(message, client); // Run the command
        break;
      
      // If the message is a note send a webhook message
      case 'note':
        client.log.debug(`Creating a note from message ${message.content}`);
        client.log.debug(`Getting operators from settings`);
        let operators = client.settings.getValue('operators'); // Get the message operators from the client's setings

        client.log.debug(`Deleting the client's original message`);
        message.delete().catch(console.error); // Delete the client's message

        // Send a note containing the message's content in the channel
        client.log.debug(`Sending the client's not message`);
        new WebhookMessage(message.channel, MessageTemplate('note', {content: message.content.replace(operators.note, '')}));
      break;
      
      // If the message is an incoming dm message handle opening a channel
      case 'incoming':
        // NTS: Change this to use assets

        client.log.debug('Getting user map from settings');
        client.log.debug('Getting the channel for the user from the user map');
        let userMap = client.settings.getValue('user-map'); // Get the user map from the client's settings
        let channel = client.channels.get(userMap[message.author.id]); // Get the channel for the user

        // If a channel exists for that user, send a message to it, otherwise create a channel with an initial message
        if (channel) {
          // Send the message to the channel
          client.log.debug('Sending a message to the channel');
          new WebhookMessage(channel, message.content,
            {
              username: message.author.username,
              avatarURL: message.author.avatarURL,
              files: Array.from(message.attachments.values())
            }
          );
        } else {
          // Create the dms guild channel
          client.log.debug('No channel found, creating a new one with initial message');
          new Channel(client, message.author.username,
            {
              type: 'text',
              recipient: message.author,
              initialMessage: MessageTemplate('dm-message', {message: message}) // Change this to use options as a message (instead of an object)
            }
          );
        }
      break;
      
      // If the message is a relayable message in a valid channel
      case 'relayable':
        //NTS: Change this to use assets

        client.log.debug('Getting channel map from settings');
        client.log.debug('Getting the user for the channel from the channel map');
        let channelMap = client.settings.getValue('channel-map'); // Get the channel map from the client's settings
        let user = client.users.get(channelMap[message.channel.id]); // Get the user for the channel

        // If the user exists send a message to that user
        if (user) {
          // NTS: Add support for sending files and images
          client.log.debug('Relaying the message to the user');
          user.send(message.content, {files: Array.from(message.attachments.values())}); // Send a message to the user
        } else {
          // NTS: This can also be caused by someone removing you as a friend (maybe if the dm channel is closed) without updating the maps
          client.log.error(`The channel map has an invalid entry for ${message.channel.id}: ${userId}`);
        }
      break;
    }
  }
}

module.exports = Message;