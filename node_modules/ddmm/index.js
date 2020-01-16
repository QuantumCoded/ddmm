const path = require('path');

module.exports.commands = require('../commands');
module.exports.events = require('../events');
module.exports.messages = require('../messages');
module.exports.relays = require('../relays');
module.exports.users = require('../users');
module.exports.import = require('../utility/import');
module.exports.logger = require('../utility/logger');
module.exports.settings = require('../utility/settings');

module.exports.getClient = () => require('../index');

module.exports.rootPath = path.join(__dirname, '..');