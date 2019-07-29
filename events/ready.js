const logger = require('../utility/logger');
const settings = require('../utility/settings');
const relay = require('../relay');
const users = require('../users');

module.exports = function() {
  const client = require('../index');

  logger.verbose('The client logged in sucessfully');

  // Get the dms guild id out of settings
  logger.debug('Getting guild id from settings');
  let guildId = settings.getValue('guild-id');

  // If the guild doesn't exists create it
  logger.debug('Checking if the guild exists');
  if (!client.guilds.has(guildId)) {
    logger.debug('Creating guild');

    // Create a guild called DMs
    client.user.createGuild('D M s').then(guild => {
      let promises = Array();

      logger.debug('Saving guild id to settings');
      settings.setValue('guild-id', guild.id); // Write guild id to settings

      logger.debug('Formatting guild');
      promises.push(guild.channels.find(c => c.name == 'General').delete()); // Delete the general voice channel
      promises.push(guild.channels.find(c => c.name == 'Voice Channels').delete()); // Delete the voice channels category
      promises.push(guild.channels.find(c => c.name == 'Text Channels').delete()); // Delete the text channels category
      promises.push(guild.createChannel('dms', {type: 'category'})); // Create a dms category

      Promise.all(promises).then(() => {
        logger.info('Guild is formatted');
        relay.initialize(); // Clear out old entries
        users.initialize(); // Initialize the users
      }).catch(logger.error);
    }).catch(logger.error);
  } else {
    logger.debug('Guild exists');
    relay.initialize(); // Initialize the relay maps
    users.initialize(); // Initialize the users
  }
};