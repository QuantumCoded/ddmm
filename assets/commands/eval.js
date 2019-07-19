const WebhookMessage = require('../../class-manager/classes/webhook-message');
const Assets = require('../index');

module.exports = function(message, client) {
  // NTS: Change this to use logger class
  message.delete()
    .catch(client.log.error);

  let result;
  let input = message.content.split(' ').slice(1).join(' ');

  try {
    result = eval(input);
  } catch(error) {
    result = error;
  }

  new WebhookMessage(message.channel, Assets.getTemplate('evaluation', {input: input, result: result}));
};