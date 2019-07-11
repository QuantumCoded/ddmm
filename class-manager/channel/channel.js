const WebhookMessage = require('../webhook/message');
const MessageTemplate = require('../message/template');

class Channel {
  client;
  recipient;
  initialMessage;

  constructor(client, name, options = {}) {
    // Define class properties
    this.client = client;
    this.recipient = options.recipient;
    this.initialMessage = options.initialMessage;

    // Build the channel from an already existing channel
    if (typeof name == 'object' && !options) {
      let channel = name;
      let channelMap = client.settings.getValue('channel-map'); // Get the channel map
      let userId = channelMap[channel.id];

      // If the channel map has a user mapped to the channel then set the recipient, otherwise fail to identify recipient
      if (userId) {
        this.recipient = client.users.get(userId);

        if (!this.recipient) {
          console.error(`The channel map is wrong, no existing user for ${channel.id}: ${userId}`);
        }
      } else {
        console.error(`Failed to identify recipient, channel map has ${channel.id}: ${userId}`);
      }
      return;
    }

    // Create the gms guild channel
    client.dms.createChannel(name, options).then(this.initializeChannel.bind(this))
      .catch(console.error);
  }

  initializeChannel(channel) {
    new WebhookMessage(channel, MessageTemplate('new-dm-channel', {user: this.recipient})); // Send an info message about who the recipient is

    // Update the map settings
    let channelMap = this.client.settings.getValue('channel-map'); // Get the channel map
    let userMap = this.client.settings.getValue('user-map'); // Get the user map

    channelMap[channel.id] = this.recipient.id; // Update the channel map
    userMap[this.recipient.id] = channel.id; // Update the user map

    this.client.settings.setValue('channel-map', channelMap); // Set the channel map
    this.client.settings.setValue('user-map', userMap); // Set the user map
    this.client.settings.save(); // Save the client settings

    // If the channel was created with an initial message then send it
    if (this.initialMessage) new WebhookMessage(channel, this.initialMessage);
  }
}

module.exports = Channel;