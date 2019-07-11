const discord = require('discord.js'); // Require discord.js to use its Client class

class Client extends discord.Client {
  dms;
  settings;
  ondmsready;

  constructor(settings) {
    super(); // Construct the discord.js client

    this.settings = settings; // Use a custom property to store the client's settings

    // Log the client in using the token stored in settings
    this.login(settings.getValue('token'))
      .catch(console.error);
  }

  // Configure a new dms guild to be suitable for use
  initializeDms(dmsGuild) {
    // NTS: Rename dmsGuild 
    let readyState = 0; // The state of initializing the guild

    // Update the ready state and run the callback when all formatting promises are settled
    let ready = function() {
      if (++readyState == 3 && this.ondmsready) this.ondmsready();
    }.bind(this);
    
    // If an attempt was made to initialize a guild that doesn't exist throw an error
    if (!dmsGuild) throw 'Error: Attempted to initialize an invalid dms guild';

    this.dms = dmsGuild; // Use a custom property to store the dms guild
    
    // Save the id of the dms guild into the settings
    this.settings.setValue('dms-guild-id', this.dms.id);
    this.settings.save();

    // Format the dms guild 
    this.dms.channels.find(c => c.name == 'General').delete().then(ready)        // Delete the General voice channel
      .catch(console.error);
    this.dms.channels.find(c => c.name == 'Voice Channels').delete().then(ready) // Delete the Voice Channels category
      .catch(console.error);
    this.dms.channels.find(c => c.name == 'Text Channels').delete().then(ready)  // Delete the Text Channels category
      .catch(console.error);
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