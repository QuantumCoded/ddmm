const WebhookMessage = require('../../class-manager/classes/webhook-message');
const Assets = require('../index');

module.exports = function(message, client) {
  message.delete().catch(client.log.error);
  new WebhookMessage(message.channel, Assets.getTemplate('help', client.settings.getValue('operators')));
};