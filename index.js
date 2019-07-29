const discord = require('discord.js');
const settings = require('./utility/settings');
const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, 'events');
const eventHandlers = fs.readdirSync(eventsPath);

const token = settings.getValue('token');
const client = new discord.Client();

client.login(token);

eventHandlers.forEach(name => {
  client.on(name.replace('.js',''), require(path.join(eventsPath, name)));
});

module.exports = client;