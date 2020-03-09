/**
 * Relays module
 * @module ddmm/relays
 */

const ddmm = require('ddmm');
const User = require('discord.js').User;
const GuildChannel = require('discord.js').GuildChannel;
const Message = require('discord.js').Message;

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

/**
 * The relay that connects a user's DMs to a guild channel.
 */
class Relay {

  /**
   * Constructs a relay binding a user's DMs to a guildChannel.
   * @param {User} user The user to construct the relay for
   * @param {GuildChannel} guildChannel The channel to bind the relay to
   */
  constructor(user, guildChannel) {
    /** The user. */
    this.user = user;
    /** The user's id. */
    this.userId = user.id;

    /** The guild channel. */
    this.channel = guildChannel;
    /** The guild channel's id. */
    this.channelId = guildChannel.id;

    /** The user's dm channel. */
    this.dms = user.dmChannel;
  }
}

/**
 * The map containing all the relays with some extra functionality for creating / modifying them.
 * @extends Map
 */
class Relays extends Map {

  /**
   * The method for validating and setting up relays.
   * @param {string} userId The id of the user
   * @param {string} channelId The id of the guildChannel
   */
  _initializeRelay(userId, channelId) {
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
  
      this.delete(userId);
      this.delete(channelId);
  
      delete links[userId];
      fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
    }
  }

  /**
   * Initialize all the relays in the links.json file.
   */
  initialize() {
    ddmm.logger.verbose('Initializing relays...');
    Object.entries(links).forEach(entry => this._initializeRelay(...entry));
    ddmm.logger.verbose('Finished!');
  }

  /**
   * Creates a relay and stores it in the links.json file.
   * @param {User} user The user to create the relay for
   * @param {Message} initialMessage The message to create the relay from
   */
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
      this._initializeRelay(user.id, channel.id);
  
      // Add the relay link to the links file
      links[user.id] = channel.id;
      fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
  
      ddmm.logger.debug('Sending messages to channel');
      
      ddmm.messages.send(channel, 'new-channel', user);
      ddmm.messages.send(channel, 'message', initialMessage);
    }).catch(ddmm.logger.error);
  }

  /**
   * Removes a relay from the map and the links.json file.
   * @param {Relay} relay The relay to remove
   */
  deleteRelay = function(relay) {
    if (this.has(relay.userId)) this.delete(relay.userId);
    if (this.has(relay.channelId)) this.delete(relay.channelId);

    delete links[relay.userId];
    fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
  };
}

/**
 * A map of all the relays.
 * @type Relays
 */
module.exports = new Relays();