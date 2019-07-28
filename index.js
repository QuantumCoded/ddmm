const path = require('path'); // Require the path module to reference the settings file path
const Users = require('./users');
const logger = require('./logger');

const { Settings, Client, Guild, WebhookMessage, Message, MessageTemplate } = require('./class-manager'); // Destruct the required classes form the class manager

const settings = new Settings(path.join(__dirname, '/settings.json')); // Load the client's settings
const client = new Client(settings); // Create a client from the settings

// When the client is ready
client.onready = function() {
  logger.verbose('The client logged in sucessfully');
  logger.info('The bot is now ready to use');

  // Get the dms guild id out of settings
  let guildId = client.settings.getValue('guild-id');
  logger.debug('Got guild id from settings');

  client.guild = client.guilds.get(guildId);
  logger.debug('Attaching guild to the client');

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

  // If the client does not have a dms guild, make one
  if (!client.guild) {
    logger.debug('Failed to find or attach a valid guild to the client');
    new Guild(client);
  } else logger.debug('Guild was successfully attached to the client');
};

// When the client's dms are initialized
client.onguildready = function() {
  // Send a message welcoming the client
  logger.verbose('The client\'s guild has been initialized');
  logger.debug('Sending a welcome message to the client');
  new WebhookMessage(client.guild.general, MessageTemplate('welcome', {name: client.user.username, operators: client.settings.getValue('operators')}));
};

// When the client sends or receives a message
client.onmessage = function(message) {
  let operators = client.settings.getValue('operators'); // Get the operators map out of settings
  let channelMap = client.settings.getValue('channel-map'); // Get the channel map out of settings [to be depricated]
  let recipient = Users.getChannelRecipient(message.channel.id);

  let type;
  
  if (!client.guild) return;

  // NTS: Change .get to .has
  // NTS: const startsWithOperator = Object.values(operators).some((operator) => msg.channel.startsWith(operator));
  // NTS: Change this to use camel case

  // Create a flag for important characteristics or each message
  let is_channel_relayable = Boolean(channelMap[message.channel.id] && client.guild.channels.get(message.channel.id)); // Was the message sent in a relayable guild channel
  let is_incoming = Boolean(client.user.id != message.author.id && message.channel.type == 'dm');                      // Was the message sent in a dm channel by another user
  let is_internal = Boolean(message.channel.type == 'text' && message.guild.id == client.guild.id);                    // Was the message sent in the server
  let is_command = Boolean(is_internal && message.content.startsWith(operators.command));                              // Was the message internal and using the command operator
  let is_note = Boolean(is_internal && message.content.startsWith(operators.note));                                    // Was the message internal and using the note operator
  let is_relayable = Boolean((!message.author.bot && recipient && !(is_command || is_note)));                          // Was the message in a relayabe channel and a valid relayable message

  // A code that represents the state of all the conditions above
  let debug_type_code = (is_channel_relayable << 5) +
                        (is_incoming          << 4) +
                        (is_internal          << 3) +
                        (is_command           << 2) +
                        (is_note              << 1) +
                        (is_relayable         << 0);

  logger.silly(`Recieved a message with type code ${debug_type_code}`);

  // Type the message
  if (is_incoming) type = 'incoming';   // If the message was sent by another user in a dms channel then it's an incomming message
  if (is_relayable) type = 'relayable'; // If the message was sent in a dms guild channel and is valid then it's a relayable message
  if (is_command) type = 'command';     // If the message was sent in the dms guild and is a valid command it's a command message
  if (is_note) type = 'note';           // If the message was sent in the dms guild and is a valid note it's a note message

  // If the message is of a valid type then construct it
  if (type) {
    logger.debug(`Processing a message of type ${type} (${debug_type_code})`);
    new Message(type, message, client);
  }
};