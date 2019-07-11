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
    this.type = type;
    this.client = client; // Set the client value to the client
    this.author = message.author; // Set the author value to the author of the message
    this.channel = message.channel; // Set the channel value to the channel of the message
    this.content = message.content; // Set the content value to the content of the message

    // Handle the message by type
    switch(type) {
      // If the message is a command execute the command
      case 'command':
        Command(message, client);
        break;
      
      // If the message is a note send a webhook message
      case 'note':
        let operators = client.settings.getValue('operators');
        let note_opperator = operators.note;

        message.delete().catch(console.error);
        new WebhookMessage(message.channel, MessageTemplate('note', {content: message.content.replace(note_opperator, '')}));
      break;
      
      // If the message is an incoming dm message handle opening a dms guild channel
      case 'incoming':
        let userMap = client.settings.getValue('user-map');
        let channelId = userMap[message.author.id];
        let channel = client.channels.get(channelId);

        // If a dms guild channel already exists send a message to it otherwise create it with an initial message
        if (channel) {
          // Send the message to the channel
          new WebhookMessage(channel, message.content, {username: message.author.username, avatarURL: message.author.avatarURL}); // Add support for sending images and files etc too
        } else {
          // Create the dms guild channel
          new Channel(client, message.author.username, {type: 'text', recipient: message.author, initialMessage: MessageTemplate('dm-message', {message: message})});
        }
      break;
      
      // If the message is a relayable message in a valid channel
      case 'relayable':
        let channelMap = client.settings.getValue('channel-map');
        let userId = channelMap[message.channel.id];
        let user = client.users.get(userId);

        // If the channel map contains a valid user for the channel send that user the message
        if (user) {
          user.send(message.content); // Add support for sending files and images
        } else {
          console.error(`The channel map has an invalid entry for ${message.channel.id}: ${userId}`);
        }
      break;
    }
  }
}

module.exports = Message;