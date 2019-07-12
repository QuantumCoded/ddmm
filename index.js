const path = require('path'); // Require the path module to reference the settings file path
const { Settings, Client, DmsGuild, WebhookMessage, Message, MessageTemplate } = require('./class-manager'); // Import the required classes form the class manager

const settings = new Settings(path.join(__dirname, '/settings.json')); // Load the client's settings
const client = new Client(settings); // Create a client from the settings

// When the client is ready
client.onready = function() {
  let dmsGuildId = client.settings.getValue('dms-guild-id'); // Get the dms guild id out of settings

  /* Note To Self
    * Remove the dmsGuildId check
  */

  // Check if the dms guild id is a valid guild
  if (dmsGuildId) {
    let dmsGuild = client.guilds.get(dmsGuildId); // Get the guild from the dms guild id

    // If the guild is valid
    if (dmsGuild) {
      // NTS: Rename client.dms to client.guild
      client.dms = dmsGuild; // Use the guild as the client's dms guild

      // PREFORM A MAPS CHECK HERE

      /* Note To Self
        * Create a Users class
        * Get the path from a settings value
        * Store the mapped channel id in the users JSON file
        * Scan the assets/users directory and build a map from the link stored in each file
        * Validate the map against the client's users list and the guild's channel list
        * Use .getChannel(userId) and .getUser(channelId) to get values from the map
        * Use .createLink(userId, channelId) to create a link value for a user
        * Use .initialize(userId) to create a file for a user
        * Use .setProperty(userId, name, value) and .getProperty(userId, name) to get user properties
      */
    }
  }

  // NTS: Rename DmsGuild to Guild
  // If the client does not have a dms guild, make one
  if (!client.dms) new DmsGuild(client);
};

// NTS: Rename .ondmsready to .onguildready
// When the client's dms are initialized
client.ondmsready = function() {
  // Send a message welcoming the client
  new WebhookMessage(client.dms.general, MessageTemplate('welcome', {name: client.user.username, operators: client.settings.getValue('operators')}));
};

// When the client sends or receives a message
client.onmessage = function(message) {
  let operators = client.settings.getValue('operators'); // Get the operators map out of settings
  let channelMap = client.settings.getValue('channel-map'); // Get the channel map out of settings [to be depricated]
  let type;
  
  // Create a flag for important characteristics or each message
  let is_channel_dm = Boolean(channelMap[message.channel.id] && client.dms.channels.get(message.channel.id));              // Was the message sent in a dms guild channel
  let is_dm = Boolean(client.user.id != message.author.id && message.channel.type == 'dm');                                // Was the message sent in a dm channel by another user
  let is_internal = Boolean(message.channel.type != 'dm' && message.guild.id == client.settings.getValue('dms-guild-id')); // Was the message sent in the server
  let is_command = Boolean(is_internal && message.content.startsWith(operators.command));                                  // Was the message internal and using the command operator
  let is_note = Boolean(is_internal && message.content.startsWith(operators.note));                                        // Was the message internal and using the note operator
  let is_relayable = Boolean((!message.author.bot && is_channel_dm && !(is_command || is_note)));                          // Was the message in a channel dm and a valid relayable message

  // Type the message
  if (is_dm) type = 'incoming';         // If the message was sent by another user in a dms channel then it's an incomming message
  if (is_relayable) type = 'relayable'; // If the message was sent in a dms guild channel and is valid then it's a relayable message
  if (is_command) type = 'command';     // If the message was sent in the dms guild and is a valid command it's a command message
  if (is_note) type = 'note';           // If the message was sent in the dms guild and is a valid note it's a note message

  // If the message is of a valid type then construct it
  if (type) new Message(type, message, client);
};