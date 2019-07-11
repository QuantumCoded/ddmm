const discord = require('discord.js');

class Client extends discord.Client {
  dms;
  settings;
  ondmsready;

  constructor(settings) {
    super(); // Construct the client
    
    this.settings = settings; // Define the client's settings

    // Log the client in using the token
    this.login(settings.getValue('token'))
      .catch(console.error);
  }

  // Configure a new dms guild to be suitable for use
  initializeDms(dmsGuild) {
    
    // Ensure the dms guild is valid
    if (!dmsGuild) {
      console.error('Error: Attempted to initialize an invalid dms guild');
      return;
    }

    this.dms = dmsGuild; // Set the client's dms to the dms guild
    this.dms.general = this.dms.channels.find(c => c.name == 'general'); // Define the general channel

    let readyState = 0; // The state of initializing the guild

    // Update the ready state and run the callback when done
    let ready = function() {
      if (++readyState == 3 && this.ondmsready) this.ondmsready();
    }.bind(this);
    
    // Save the id of the dms guild into the settings
    this.settings.setValue('dms-guild-id', this.dms.id);
    this.settings.save();

    // Format the dms guild 
    this.dms.channels.find(c => c.name == 'General').delete().then(ready)
      .catch(console.error);
    this.dms.channels.find(c => c.name == 'Voice Channels').delete().then(ready)
      .catch(console.error);
    this.dms.channels.find(c => c.name == 'Text Channels').delete().then(ready)
      .catch(console.error);
  }

  set onready(callback) {
    this.on('ready', callback)
  }

  set onmessage(callback) {
    this.on('message', callback);
  }
}

module.exports = Client;