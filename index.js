const path = require('path'); // Require the path module to reference the settings file path
const { createLogger, format, transports } = require('winston'); // Destruct the required methods from winston
const { combine, timestamp, label, printf, colorize } = format;  // Destruct the required methods from format

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']; // Define the log levels
const arguments =  process.argv.slice(2); // Get arguments used when starting the script

let log_level = 0; // The level of logs to display

// If there is a -L parameter change the log level
if (arguments.includes('-l')) {
  let index = arguments.indexOf('-l'); // Get the index of the -l operator
  log_level = parseInt(arguments[index + 1]); // Set the level to the one specified
}

// Create the logger to send output to
const logger = createLogger({
  level: levels[log_level || 2],
  format: combine(
    colorize({ level: true }),
    timestamp(),
    printf(({level, message, timestamp}) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new transports.Console()
  ]
});

const { Settings, Client, DmsGuild, WebhookMessage, Message, MessageTemplate } = require('./class-manager'); // Destruct the required classes form the class manager

const settings = new Settings(path.join(__dirname, '/settings.json')); // Load the client's settings
const client = new Client(settings, logger); // Create a client from the settings

// When the client is ready
client.onready = function() {
  client.log.verbose('The client logged in sucessfully');
  client.log.info('The bot is now ready to use');

  // NTS: Rename dms-guild-id to guild-id
  let dmsGuildId = client.settings.getValue('dms-guild-id'); // Get the dms guild id out of settings
  client.log.debug('Got guild id from settings');

  // NTS: Rename client.dms to client.guild
  client.dms = client.guilds.get(dmsGuildId);
  client.log.debug('Attaching guild to the client');

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

  // NTS: Rename DmsGuild to Guild
  // If the client does not have a dms guild, make one
  if (!client.dms) {
    client.log.debug('Failed to find or attach a valid guild to the client');
    new DmsGuild(client);
  } else client.log.debug('Guild was successfully attached to the client');
};

// NTS: Rename .ondmsready to .onguildready
// When the client's dms are initialized
client.ondmsready = function() {
  // Send a message welcoming the client
  client.log.verbose('The client\'s guild has been initialized');
  client.log.debug('Sending a welcome message to the client');
  new WebhookMessage(client.dms.general, MessageTemplate('welcome', {name: client.user.username, operators: client.settings.getValue('operators')}));
};

// When the client sends or receives a message
client.onmessage = function(message) {
  let operators = client.settings.getValue('operators'); // Get the operators map out of settings
  let channelMap = client.settings.getValue('channel-map'); // Get the channel map out of settings [to be depricated]
  let type;
  
  if (!client.dms) return;

  // Create a flag for important characteristics or each message
  let is_channel_relayable = Boolean(channelMap[message.channel.id] && client.dms.channels.get(message.channel.id)); // Was the message sent in a relayable guild channel
  let is_incoming = Boolean(client.user.id != message.author.id && message.channel.type == 'dm');                    // Was the message sent in a dm channel by another user
  let is_internal = Boolean(message.channel.type != 'dm' && message.guild.id == client.dms.id);                      // Was the message sent in the server
  let is_command = Boolean(is_internal && message.content.startsWith(operators.command));                            // Was the message internal and using the command operator
  let is_note = Boolean(is_internal && message.content.startsWith(operators.note));                                  // Was the message internal and using the note operator
  let is_relayable = Boolean((!message.author.bot && is_channel_relayable && !(is_command || is_note)));             // Was the message in a relayabe channel and a valid relayable message

  // A code that represents the state of all the conditions above
  let debug_type_code = (is_channel_relayable << 5) +
                        (is_incoming          << 4) +
                        (is_internal          << 3) +
                        (is_command           << 2) +
                        (is_note              << 1) +
                        (is_relayable         << 0);

  client.log.silly(`Recieved a message with type code ${debug_type_code}`);

  // Type the message
  if (is_incoming) type = 'incoming';   // If the message was sent by another user in a dms channel then it's an incomming message
  if (is_relayable) type = 'relayable'; // If the message was sent in a dms guild channel and is valid then it's a relayable message
  if (is_command) type = 'command';     // If the message was sent in the dms guild and is a valid command it's a command message
  if (is_note) type = 'note';           // If the message was sent in the dms guild and is a valid note it's a note message

  // If the message is of a valid type then construct it
  if (type) {
    client.log.debug(`Processing a message of type ${type} (${debug_type_code})`);
    new Message(type, message, client);
  }
};