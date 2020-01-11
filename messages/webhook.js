const ddmm = require('ddmm');

module.exports = function(channel, content) {
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
                .catch(ddmm.logger.error);
            } else ddmm.logger.error('There was a problem constructing the webhook');
          });
      } else {
        webhook.send(content, options) // Send the message
          .catch(ddmm.logger.error);
      }
    });
};