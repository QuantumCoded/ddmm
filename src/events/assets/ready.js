const ddmm = require('ddmm');

const path = require('path');

module.exports = function() {
  let client = ddmm.getClient();

  ddmm.commands.initialize();
  ddmm.messages.initialize();

  ddmm.logger.info('The verbosity of the output can be changed with -l <level> (I suggest 4 for debugging)');
  ddmm.logger.info('The client logged in sucessfully!');

  // Get the dms guild id out of settings
  ddmm.logger.debug('Getting guild id from settings');
  let guildId = ddmm.settings.getValue('guild-id');

  // If the guild doesn't exists create it
  ddmm.logger.verbose('Checking if the guild exists');
  if (!client.guilds.has(guildId)) {
    ddmm.logger.verbose('Creating guild');

    // Create a guild called DMs
    client.user.createGuild('D M s').then(guild => {
      let promises = Array();

      // NTS: This should probably have some form of error handling that way it doesn't just crash if any of this fails
        //    Not sure what this error handling should be, but something is definately needed

      ddmm.logger.debug('Saving guild id to settings');
      ddmm.settings.setValue('guild-id', guild.id); // Write guild id to settings

      ddmm.logger.verbose('Formatting guild');
      promises.push(guild.channels.find(c => c.name === 'General').delete());        // Delete the general voice channel
      promises.push(guild.channels.find(c => c.name === 'Voice Channels').delete()); // Delete the voice channels category
      promises.push(guild.channels.find(c => c.name === 'Text Channels').delete());  // Delete the text channels category
      promises.push(guild.createChannel('dms', {type: 'category'}));                 // Create a dms category

      // Add the custom emojis
      promises.push(guild.createEmoji(path.join(__dirname, '../../img/xbutton.png'), 'xbutton'));               // Create the emoji for the x button
      promises.push(guild.createEmoji(path.join(__dirname, '../../img/circlebutton.png'), 'circlebutton'));     // Create the emoji for the circle button
      promises.push(guild.createEmoji(path.join(__dirname, '../../img/squarebutton.png'), 'squarebutton'));     // Create the emoji for the square button
      promises.push(guild.createEmoji(path.join(__dirname, '../../img/trianglebutton.png'), 'trianglebutton')); // Create the emoji for the triangle button

      Promise.all(promises).then(() => {
        ddmm.logger.info('Guild is formatted');
        ddmm.relays.initialize(); // Set up the channel relays and remove any invalid ones
        ddmm.profiles.initialize(); // Initialize the user profiles
      }).catch(ddmm.logger.error);
    }).catch(ddmm.logger.error);
  } else {
    ddmm.logger.debug('Guild exists');
    ddmm.relays.initialize(); // Set up the channel relays and remove any invalid ones
    ddmm.profiles.initialize(); // Initialize the user profiles
  }
};