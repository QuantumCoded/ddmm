const path = require('path');
const { Settings, Client, DmsGuild, WebhookMessage, Message, MessageTemplate } = require('./class-manager'); // Import the required classes form the class manager

const settings = new Settings(path.join(__dirname, '/config/settings.json')); // Load the user's settings
const client = new Client(settings); // Create a client of the user

// When the client becomes ready
client.onready = function() {
  console.info('client logged in successfully');

  let dmsGuildId = client.settings.getValue('dms-guild-id');

  // Check if the user has a dms guild (and delete it for the time being)
  if (dmsGuildId) {
    let oldDmsGuild = client.guilds.get(dmsGuildId);
    if (oldDmsGuild) {
      console.info('the user has an existing dms guild');
      client.dms = oldDmsGuild;

      // PREFORM A MAPS CHECK HERE
    }
  }

  // If the client does not have a dms guild, make one
  if (!client.dms) new DmsGuild(client);
};

// When the client's dms are initialized
client.ondmsready = function() {
  console.info('the dms guild is ready');

  // Send a message welcoming the client
  new WebhookMessage(client.dms.general, MessageTemplate('welcome', {name: client.user.username, operators: client.settings.getValue('operators')}));
};

// When the client sends or receives a message
client.onmessage = function(message) {
  let operators = client.settings.getValue('operators');
  let channelMap = client.settings.getValue('channel-map');
  
  let is_channel_dm = Boolean(channelMap[message.channel.id] && client.dms.channels.get(message.channel.id));              // Was the message sent in a dms guild channel
  let is_dm = Boolean(client.user.id != message.author.id && message.channel.type == 'dm');                                // Was the message sent in a dm channel by another user
  let is_internal = Boolean(message.channel.type != 'dm' && message.guild.id == client.settings.getValue('dms-guild-id')); // Was the message sent in the server
  let is_command = Boolean(is_internal && message.content.startsWith(operators.command));                                  // Was the message internal and using the command operator
  let is_note = Boolean(is_internal && message.content.startsWith(operators.note));                                        // Was the message internal and using the note operator
  let is_relayable = Boolean((!message.author.bot && is_channel_dm && !(is_command || is_note)));                          // Was the message in a channel dm and a valid relayable message

  let type;

  // Type the message
  if (is_dm) type = 'incoming';
  if (is_relayable) type = 'relayable';
  if (is_command) type = 'command';
  if (is_note) type = 'note';

  // If the message is of a valid type then construct it
  if (type) new Message(type, message, client);
};