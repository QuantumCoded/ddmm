const discord = require('discord.js'); // The discord API for node.js, yes I'm "abusing" this pls don't ban it's a cool project
const ddmm = require('ddmm');

const token = process.env.DISCORD_TOKEN || ddmm.settings.getValue('token'); // The auth token for the client
const client = new discord.Client();                                        // The client to be logged in

// Attempt to log in the client
client.login(token)
  .catch(ddmm.logger.error);
 
// Bind the event handler to the client
ddmm.events.bind(client);

module.exports = client;