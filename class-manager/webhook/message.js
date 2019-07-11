class WebhookMessage {
  channel;
  webhook;
  callback;
  
  constructor(channel, content = '', options = {}) {
    this.channel = channel; // Store the webhook channel

    // If the content is a MessageTemplate then apply the template settings
    if (typeof content == 'object' && typeof content.content == 'string' && typeof content.options =='object') {
      options = content.options;
      content = content.content;
    }

    // Search the channel for an already created webhook and store it
    channel.fetchWebhooks().then(c => this.webhook = c.find(w => w.name == channel.id))
      .catch(console.error)
      .finally(() => {

        // If there is no already created webhook then create one otherwise send the message
        if (!this.webhook) {
          channel.createWebhook(channel.id).then(w => this.webhook = w)
            .catch(console.error)
            .finally(() => {

              // If the webhook was created then send the message
              if (this.webhook) {
                this.webhook.send(content, options)
                  .catch(console.error);
              } else console.error('Error: There was a problem constructing the webhook');
            });
        } else {
          this.webhook.send(content, options).then(() => this.callback && this.callback())
            .catch(console.error);
        }
      });
  }
}

module.exports = WebhookMessage;