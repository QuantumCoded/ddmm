const WebhookMessage = require('./webhook-message');
const Assets = require('../../assets');

class Channel {
  client;
  recipient;
  initialMessage;

  constructor(client, name, options = {}) {
    client.log.debug('Constructing a channel');

    // Define class properties
    this.client = client;
    this.recipient = options.recipient;
    this.initialMessage = options.initialMessage;

    // Create the gms guild channel
    client.log.verbose(`Creating a channel for user ${name}`);
    client.guild.createChannel(name, options).then(this.initializeChannel.bind(this))
      .catch(console.error);
  }

  initializeChannel(channel) {
    this.client.log.debug('Initializing channel');
    this.client.log.debug('Sending channel info message');
    new WebhookMessage(channel, Assets.getTemplate('new-channel', this.recipient)); // Send an info message about who the recipient is

    // NTS: Change this to use assets
    // Update the map settings
    this.client.log.debug('Loading channel map and user map from settings');
    let channelMap = this.client.settings.getValue('channel-map'); // Get the channel map
    let userMap = this.client.settings.getValue('user-map'); // Get the user map

    // NTS: Change this to use assets
    // Create the channel binding
    this.client.log.debug('Adding the channel binding to maps');
    channelMap[channel.id] = this.recipient.id; // Update the channel map
    userMap[this.recipient.id] = channel.id; // Update the user map

    // NTS: Change this to use assets
    this.client.log.debug('Writing maps to settings');
    this.client.settings.setValue('channel-map', channelMap); // Set the channel map
    this.client.settings.setValue('user-map', userMap); // Set the user map
    this.client.settings.save(); // Save the client settings

    // If the channel was created with an initial message then send it
    if (this.initialMessage) {
      this.client.log.debug('The channel was constructed with an initial message');
      this.client.log.debug('Sending initial message');
      new WebhookMessage(channel, this.initialMessage);
    }
  }
}

module.exports = Channel;