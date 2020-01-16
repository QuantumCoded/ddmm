const ddmm = require('ddmm');

const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require path to get file paths

const linksPath = path.join(__dirname, 'links.json'); // ./links.json

// Create the links file if it doesn't exist
try {
  fs.accessSync(linksPath, fs.constants.F_OK);
} catch {
  fs.writeFileSync(linksPath, '{}');
}

const links = JSON.parse(fs.readFileSync(linksPath,'utf8')); // Load the links in from the links file

// An individual relay connecting a user's DMs guild channel to them and their DMs
class Relay {
  constructor(user, guildChannel) {
    this.user = user;
    this.userId = user.id;

    this.channel = guildChannel;
    this.channelId = guildChannel.id;

    this.dms = user.dmChannel;
  }
}

// The map containing all the relays with some extra functionality for creating / modifying them
class Relays extends Map {

  // The method for validating and setting up links
  _initializeLink(userId, channelId) {
    let client = require('../index');

    // Validate the link
    if (client.users.has(userId) && client.channels.has(channelId)) {
      let user = client.users.get(userId);
      let guildChannel = client.channels.get(channelId);
  
      let relay = new Relay(user, guildChannel);
  
      this.set(userId, relay);
      this.set(channelId, relay);
  
      ddmm.logger.debug(`Created relay for ${user.username}`);
    } else {
      ddmm.logger.warn(`Invalid link {${userId}:${channelId}} removing entry (This should be safe to ignore)`);
  
      relays.delete(userId);
      relays.delete(channelId);
  
      delete links[userId];
      fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
    }
  }

  // Calls _initializeLink on all the link pairs
  initialize() {
    ddmm.logger.verbose('Initializing relays...');
    Object.entries(links).forEach(entry => this._initializeLink(...entry));
    ddmm.logger.verbose('Finished!');
  }

  createRelay(user, initialMessage) {
    let client = require('../index');

    let guildId = ddmm.settings.getValue('guild-id'); // The dms guild id
    let guild = client.guilds.get(guildId); // The dms guild
  
    let profileName; // The name of the user in their profile if it exists
  
    // If the user doesn't have a profile create one, otherwise create the channel with their profile
    if (ddmm.profiles.has(user.id)) {
      let profile = ddmm.profiles.get(user.id);
  
      profileName = profile.getProperty('name');
    } else {
      ddmm.logger.debug(`Creating profile for ${user.username}`);
  
      ddmm.profiles.createProfile(user.id, {
        name: user.username
      });
    }
  
    // Create a channel for the user
    ddmm.logger.debug(`Creating a channel for user ${user.username}`);
  
    guild.createChannel(profileName || user.username, {
      type: 'text',
      parent: guild.channels.find(c => c.type === 'category' && c.name === 'dms')
    }).then(channel => {
      ddmm.logger.debug('Channel created');
  
      // Add the relay to the map
      this._initializeLink(user.id, channel.id);
  
      // Add the relay link to the links file
      links[user.id] = channel.id;
      fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
  
      ddmm.logger.debug('Sending messages to channel');
      
      ddmm.messages.send(channel, 'new-channel', user);
      ddmm.messages.send(channel, 'message', initialMessage);
    }).catch(ddmm.logger.error);
  }

  // Remove a relay from the map
  deleteRelay = function(relay) {
    if (relays.has(relay.userId)) relays.delete(relay.userId);
    if (relays.has(relay.channelId)) relays.delete(relay.channelId);

    delete links[relay.userId];
    fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
  };
}

module.exports = new Relays();