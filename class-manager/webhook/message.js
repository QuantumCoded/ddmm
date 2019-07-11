class WebhookMessage {  
  constructor(channel, content = '', options = {}) {
    let webhook;

    // If the content is a MessageTemplate then apply the template settings
    if (typeof content == 'object' && typeof content.content == 'string' && typeof content.options =='object') {
      options = content.options; // Overwrite the options parameter
      content = content.content; // Overwrite the content parameter
    }

    // Search the channel for a webhook
    channel.fetchWebhooks().then(c => webhook = c.find(w => w.name == channel.id))
      .catch(console.error)
      .finally(() => {

        // If the channel has no webhook then create one, otherwise send the message
        if (!webhook) {
          channel.createWebhook(channel.id).then(w => webhook = w) // Create a new webhook
            .catch(console.error)
            .finally(() => {

              // If the webhook was created then send the message, otherwise error
              if (webhook) {
                webhook.send(content, options) // Send the message
                  .catch(console.error);
              } else console.error('Error: There was a problem constructing the webhook');
            });
        } else {
          webhook.send(content, options) // Send the message
            .catch(console.error);
        }
      });
  }
}

module.exports = WebhookMessage;