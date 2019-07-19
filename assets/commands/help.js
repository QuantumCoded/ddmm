const WebhookMessage = require('../../class-manager');
const Assets = require('../index');

module.exports = function(message, client) {
  new WebhookMessage(message.channel, Assets.getTemplate('help', client.settings.getValue('operators')));
};