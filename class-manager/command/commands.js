const WebhookMessage = require('../webhook/message');
const MessageTemplate = require('../message/template');

module.exports = {
  help: function(message, client) {
    new WebhookMessage(message.channel, MessageTemplate('setup', {operators: client.settings.getValue('operators')}));
  },

  eval: function(message) {
    message.delete()
      .catch(console.error);

    let result;
    let input = message.content.split(' ').slice(1).join(' ');

    try {
      result = eval(input);
    } catch(error) {
      result = error;
    }

    new WebhookMessage(message.channel, MessageTemplate('eval', {input: input, result: result}));
  },

  delguild: function(message, client) {
    new WebhookMessage() // Confirmation message using reaction select mechanics?
    // Delete the guild and all that
  }
}