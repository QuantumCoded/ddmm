const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require path to get file paths
const logger = require('../utility/logger');
const settings = require('../utility/settings');
const WebhookMessage = require('../utility/webhook-message');
const assets = require('../assets');
const users = require('../users');

const linksPath = path.join(__dirname, 'links.json'); // ./links.json

try {
  fs.accessSync(linksPath, fs.constants.F_OK);
} catch {
  fs.writeFileSync(linksPath, '{}');
}

const links = JSON.parse(fs.readFileSync(linksPath,'utf8')); // Load the links in from the links file

const userRelays = new Map(); // Map<userId, Relay>
const channelRelays = new Map(); // Map<channelId, Relay>

class Relay {
  dms;
  channel;

  constructor(dmsChannel, guildChannel) {
    this.dms = dmsChannel;
    this.channel = guildChannel;
  }
}

// Validate and create a relay from a link pair
const initializeLink = function(pair) {
  const client = require('../index');

  let userId = pair.shift(); // The id of the dms channel
  let channelId = pair.shift(); // The id of the guild channel

  // Validate the link
  if (client.users.has(userId) && client.channels.has(channelId)) {
    let dmsChannel = client.users.get(userId).dmChannel;
    let guildChannel = client.channels.get(channelId);

    let relay = new Relay(dmsChannel, guildChannel);

    userRelays.set(userId, relay);
    channelRelays.set(channelId, relay);

    logger.debug(`Created relay for ${dmsChannel.recipient.username}`);
  } else {
    logger.warn(`Invalid link {${userId}:${channelId}} removing entry`);

    userRelays.delete(userId);
    channelRelays.delete(channelId);

    delete links[userId];
    fs.writeFileSync(linksPath, JSON.stringify(links));
  }
};

// Initialize all of the links in links.json
module.exports.initialize = function() {
  logger.debug('Initializing relays...');
  Object.entries(links).forEach(initializeLink);
  logger.debug('Finished!');
};

// Create a relay for a new user
module.exports.createRelay = function(user, initialMessage) {
  const client = require('../index');

  let guildId = settings.getValue('guild-id'); // The dms guild id
  let guild = client.guilds.get(guildId); // The dms guild

  // Create a channel for the user
  logger.debug(`Creating a channel for user ${user.username}`);
  guild.createChannel(user.username, {
    parent: guild.channels.find(c => c.type == 'category' && c.name == 'dms')
  }).then(channel => {
    logger.debug('Channel created');

    // If the user doesn't have a profile create one
    if (!users.profiles.has(user.id)) {
      logger.debug(`Creating profile for ${user.username}`);

      users.createProfile(user.id, {
        name: user.username
      });
    }

    // Add the relay to the map
    initializeLink([user.id, channel.id]);

    // Add the relay link to the links file
    links[user.id] = channel.id;
    fs.writeFileSync(linksPath, JSON.stringify(links));

    logger.debug('Sending messages to channel');
    new WebhookMessage(channel, assets.getTemplate('new-channel', user));
    new WebhookMessage(channel, assets.getTemplate('message', initialMessage));
  }).catch(logger.error);
};

module.exports.userRelays = userRelays; // Export the userRelays map
module.exports.channelRelays = channelRelays; // Export the channelRelays map