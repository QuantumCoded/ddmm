const ddmm = require('ddmm');

const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require path to get file paths

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
  user;
  dms;
  channel;

  constructor(dmsChannel, guildChannel) {
    this.user = dmsChannel.recipient;
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

    ddmm.logger.debug(`Created relay for ${dmsChannel.recipient.username}`);
  } else {
    ddmm.logger.warn(`Invalid link {${userId}:${channelId}} removing entry`);

    userRelays.delete(userId);
    channelRelays.delete(channelId);

    delete links[userId];
    fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
  }
};

// Initialize all of the links in links.json
module.exports.initialize = function() {
  ddmm.logger.verbose('Initializing relays...');
  Object.entries(links).forEach(initializeLink);
  ddmm.logger.verbose('Finished!');
};

// Create a relay for a new user
module.exports.createRelay = function(user, initialMessage) {
  const client = require('../index');

  let guildId = ddmm.settings.getValue('guild-id'); // The dms guild id
  let guild = client.guilds.get(guildId); // The dms guild

  // Create a channel for the user
  ddmm.logger.debug(`Creating a channel for user ${user.username}`);
  guild.createChannel(user.username, {
    type: 'text',
    parent: guild.channels.find(c => c.type === 'category' && c.name === 'dms')
  }).then(channel => {
    ddmm.logger.debug('Channel created');

    // If the user doesn't have a profile create one
    if (!ddmm.users.profiles.has(user.id)) {
      ddmm.logger.debug(`Creating profile for ${user.username}`);

      ddmm.users.createProfile(user.id, {
        name: user.username
      });
    }

    // Add the relay to the map
    initializeLink([user.id, channel.id]);

    // Add the relay link to the links file
    links[user.id] = channel.id;
    fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));

    ddmm.logger.debug('Sending messages to channel');
    
    ddmm.messages.send(channel, 'new-channel', user);
    ddmm.messages.send(channel, 'message', initialMessage);
  }).catch(ddmm.logger.error);
};

module.exports.deleteRelay = function(user) {
  let userId = user.id;
  let channelId = links[userId];

  userRelays.delete(userId);
  channelRelays.delete(channelId);

  delete links[userId];
  fs.writeFileSync(linksPath, JSON.stringify(links, true, 2));
};

module.exports.userRelays = userRelays; // Export the userRelays map
module.exports.channelRelays = channelRelays; // Export the channelRelays map