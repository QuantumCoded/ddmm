const ddmm = require('ddmm');

module.exports = function() {
  let client = ddmm.getClient();

  ddmm.commands.initialize();
  ddmm.messages.initialize();
  //ddmm.events.initialize();

  ddmm.logger.verbose('The client logged in sucessfully!');

  // Get the dms guild id out of settings
  ddmm.logger.debug('Getting guild id from settings');
  let guildId = ddmm.settings.getValue('guild-id');

  // If the guild doesn't exists create it
  ddmm.logger.debug('Checking if the guild exists');
  if (!client.guilds.has(guildId)) {
    ddmm.logger.debug('Creating guild');

    // Create a guild called DMs
    client.user.createGuild('D M s').then(guild => {
      let promises = Array();

      ddmm.logger.debug('Saving guild id to settings');
      ddmm.settings.setValue('guild-id', guild.id); // Write guild id to settings

      ddmm.logger.debug('Formatting guild');
      promises.push(guild.channels.find(c => c.name === 'General').delete());        // Delete the general voice channel
      promises.push(guild.channels.find(c => c.name === 'Voice Channels').delete()); // Delete the voice channels category
      promises.push(guild.channels.find(c => c.name === 'Text Channels').delete());  // Delete the text channels category
      promises.push(guild.createChannel('dms', {type: 'category'}));                 // Create a dms category

      Promise.all(promises).then(() => {
        ddmm.logger.info('Guild is formatted');
        ddmm.relay.initialize(); // Clear out old entries
        ddmm.users.initialize(); // Initialize the users
      }).catch(ddmm.logger.error);
    }).catch(ddmm.logger.error);
  } else {
    ddmm.logger.debug('Guild exists');
    ddmm.relay.initialize(); // Initialize the relay maps
    ddmm.users.initialize(); // Initialize the users
  }
};