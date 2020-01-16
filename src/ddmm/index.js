const path = require('path');

module.exports.commands = require('../commands');
module.exports.events = require('../events');
module.exports.messages = require('../messages');
module.exports.profiles = require('../profiles');
module.exports.relays = require('../relays');
module.exports.import = require('../utility/import');
module.exports.logger = require('../utility/logger');
module.exports.settings = require('../utility/settings');

module.exports.getClient = () => require('../index');