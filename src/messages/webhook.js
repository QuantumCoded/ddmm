/**
 * Webhooks module, used for constructing and sending messages using webhooks
 * @module ddmm/messages/webhook
 */

const ddmm = require('ddmm');
const TextChannel = require('discord.js').TextChannel;

/**
 * @callback WebhookCallback
 * @param {Message} message The message that was sent
 */

/**
 * Creates or uses a webhook to send a message to a channel
 * @param {TextChannel} channel The channel to send the message to
 * @param {Object} content The content of the message
 * @param {WebhookCallback} callback The function to be called after the message is sent
 * @example
const webhook = require('messages/webhook');

let message = {
  options: {
    username: 'User',
    embeds: [{
      title: 'Embed',
      description: 'This is a sample embed'
    }]
  }
};

webhook(channel, message, function() {
  console.log('the message was sent!');
});
 */
module.exports = function(channel, content, callback) {
  let webhook;

  let options = content.options;
  content = content.content;

  // Search the channel for a webhook
  channel.fetchWebhooks().then(c => webhook = c.find(w => w.name === channel.id))
    .catch(ddmm.logger.error)
    .finally(() => {

      // If the channel has no webhook then create one, otherwise send the message
      if (!webhook) {
        channel.createWebhook(channel.id).then(w => webhook = w) // Create a new webhook
          .catch(ddmm.logger.error)
          .finally(() => {

            // If the webhook was created then send the message, otherwise error
            if (webhook) {
              webhook.send(content, options) // Send the message
                .then(callback)
                .catch(ddmm.logger.error);
            } else ddmm.logger.error('There was a problem constructing the webhook');
          });
      } else {
        webhook.send(content, options) // Send the message
          .then(callback)
          .catch(ddmm.logger.error);
      }
    });
};