// Export classes as properties of the class manager
module.exports.Client          = require('./client/client');
module.exports.Command         = require('./command/command');
module.exports.DmsGuild        = require('./guild/dms');
module.exports.Message         = require('./message/message');
module.exports.MessageTemplate = require('./message/template');
module.exports.Settings        = require('./settings/settings');
module.exports.WebhookMessage  = require('./webhook/message');