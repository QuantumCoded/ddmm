const discord = require('discord.js'); // Require discord.js to use its Client class
const logger = require('../../logger'); // Require logger to send logs to the console

class Client extends discord.Client {
  guild;
  general;
  settings;
  onguildready;

  constructor(settings) {
    logger.debug('Constructing client');

    super(); // Construct the discord.js client

    this.settings = settings; // Use a custom property to store the client's settings

    logger.verbose('Logging in');

    // Log the client in using the token stored in settings
    this.login(settings.getValue('token'))
      .catch(logger.error);
  }

  // Configure a new dms guild to be suitable for use
  initializeDms(guild) {
    logger.debug('Initializing guild');

    this.guild = guild // Use a custom property to store the dms guild
    this.guild.general = guild.channels.find(c => c.name == 'general'); // Use a custom property to point to the general channel
    // NTS: Save this channel later maybe?

    let readyState = 0; // The state of initializing the guild

    // Update the ready state and run the callback when all formatting promises are settled
    let ready = function() {
      readyState++; // Update the ready state
      if (readyState == 3 && this.onguildready) {
        this.onguildready();
      }
    }.bind(this);
    
    // If an attempt was made to initialize a guild that doesn't exist log an error
    if (!guild) {
      logger.error('An attempt was made to initialize an invalid guild');
      return;
    }

    // Save the id of the dms guild into the settings
    this.settings.setValue('guild-id', this.guild.id);
    this.settings.save();

    // Delete the General voice channel
    logger.debug('Deleting General voice channel');
    this.guild.channels.find(c => c.name == 'General').delete().then(ready)
      .catch(logger.error);

    // Delete the Voice Channels category
    logger.debug('Deleting Voice Channels category');
    this.guild.channels.find(c => c.name == 'Voice Channels').delete().then(ready)
      .catch(logger.error);

    // Delete the Text Channels category
    logger.debug('Deleting Text Channels category');
    this.guild.channels.find(c => c.name == 'Text Channels').delete().then(ready)
      .catch(logger.error);
  }

  // Add a listener for when the client is ready
  set onready(callback) {
    this.on('ready', callback)
  }

  // Add a listener for when the client is getting a message
  set onmessage(callback) {
    this.on('message', callback);
  }
}

module.exports = Client;