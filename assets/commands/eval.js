const WebhookMessage = require('../../utility/webhook-message');
const logger = require('../../utility/logger');
const assets = require('../index');

module.exports = function(message, client) {
  // NTS: Change this to use logger class
  message.delete()
    .catch(logger.error);

  let result;
  let input = message.content.split(' ').slice(1).join(' ');

  try {
    result = eval(input);
  } catch(error) {
    result = error;
  }

  new WebhookMessage(message.channel, assets.getTemplate('evaluation', {input: input, result: result}));
};