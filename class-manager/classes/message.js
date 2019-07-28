const Channel = require('./channel');
const WebhookMessage = require('./webhook-message');
const Assets = require('../../assets');
const Users = require('../../users');

class Message {
  constructor(type, message, client) {
    client.log.debug('Constructing a message');

    let user;

    // Handle the message by type
    client.log.debug(`Handling the message type ${type}`);
    switch(type) {
      // If the message is a command execute the command
      case 'command':
        client.log.debug(`Parsing command from message ${message.content}`);
        let command = message.content.split(' ').shift(); // Get the first block of the string
        let command_operator = client.settings.getValue('operators').command; // Get the command operator
        let name = command.replace(command_operator, ''); // Remove the command operator from the string

        client.log.debug(`Running command ${name}`);
        Assets.runCommand(name, message, client) // Run the command
        break;
      
      // If the message is a note send a webhook message
      case 'note':
        client.log.debug(`Creating a note from message ${message.content}`);
        client.log.debug(`Getting operators from settings`);
        let note_operator = client.settings.getValue('operators').note; // Get the note operator from the client's setings

        client.log.debug(`Deleting the client's original message`);
        message.delete().catch(client.log.error); // Delete the client's message

        // Send a note containing the message's content in the channel
        client.log.debug(`Sending the client's note message`);
        new WebhookMessage(message.channel, Assets.getTemplate('note', message.content.replace(note_operator, '')));
      break;
      
      // If the message is an incoming dm message handle sending the message
      case 'incoming':
        // If the user exists then send them a message otherwise create a channel
        if (Users.userExists(message.author.id)) {
          user = Users.getUser(message.author.id); // Get the user
          let channel = client.channels.get(user.getProperty('channel')); // Get the user's channel

          client.log.debug('Sending a message to the channel');
          new WebhookMessage(channel, Assets.getTemplate('message', message)); // Send a message to the user's channel
        } else {
          // Create a new channel for the user with an initial message
          new Channel(client, message.author.username, {
            type: 'text',
            recipient: message.author,
            initialMessage: Assets.getTemplate('message', message),
          });
        }
      break;

      // If the message is a relayable message in a valid channel
      case 'relayable':
        user = Users.getChannelRecipient(message.channel.id); // Get the user for the channel

        // If the user exists send a message to that user
        if (user) {
          client.log.debug('Relaying the message to the user');
          client.users.get(user.getProperty('id')).send(message.content, {files: Array.from(message.attachments.values()).map(a => a.url)}); // Send a message to the user
        } else {
          // NTS: This can also be caused by someone removing you as a friend (maybe if the dm channel is closed) without updating the maps
        }
      break;
    }
  }
}

module.exports = Message;