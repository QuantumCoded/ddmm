module.exports.commands = require('../../../commands');
module.exports.events = require('..');
module.exports.messages = require('../../../messages');
module.exports.relay = require('../../../relay');
module.exports.users = require('../../../users');
module.exports.import = require('../../../utility/import');
module.exports.logger = require('../../../utility/logger');
module.exports.settings = require('../../../utility/settings');

module.exports.getClient = () => require('../../../index');