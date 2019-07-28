const WebhookMessage = require('./webhook-message');
const Assets = require('../../assets');
const Users = require('../../users');
const logger = require('../../utility/logger');

class Channel {
  client;
  recipient;
  initialMessage;

  constructor(client, name, options = {}) {
    logger.debug('Constructing a channel');

    // Define class properties
    this.client = client;
    this.recipient = options.recipient;
    this.initialMessage = options.initialMessage;

    // Create the gms guild channel
    logger.verbose(`Creating a channel for user ${name}`);
    client.guild.createChannel(name, options).then(this.initializeChannel.bind(this))
      .catch(console.error);
  }

  initializeChannel(channel) {
    logger.debug('Initializing channel');
    logger.debug('Sending channel info message');
    new WebhookMessage(channel, Assets.getTemplate('new-channel', this.recipient)); // Send an info message about who the recipient is

    let user = Users.getUser(this.recipient.id);

    if (!user) {
      Users.createUser(this.recipient.id, {
        name: this.recipient.username,
        id: this.recipient.id,
        channel: channel.id
      });
    }

    // If the channel was created with an initial message then send it
    if (this.initialMessage) {
      logger.debug('The channel was constructed with an initial message');
      logger.debug('Sending initial message');
      new WebhookMessage(channel, this.initialMessage);
    }
  }
}

module.exports = Channel;