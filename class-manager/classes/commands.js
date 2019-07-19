const WebhookMessage = require('./webhook-message');
const MessageTemplate = require('./template');

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

// THIS FILE AND METHOD FOR STORING COMMANDS IS GOING TO BE DEPRICATED
// Instead commands will be stored as separate files named after their command name in assets/commands
// Each one of the command files MUST export a function taking client and message and be a javascript file
// This way packs of user-created assets may be imported following the same standard