const discord = require('discord.js');
const settings = require('./settings');

const token = settings.getValue('token');
const client = new discord.Client();

client.login(token);

module.exports = client;