const ddmm = require('ddmm');

module.exports = function(message) {
  let name = message.content.split(' ').slice(1).join(' ');

  if (!ddmm.relay.channelRelays.has(message.channel.id)) {
    ddmm.logger.warn('Attempt to rename a non-relayable channel or relays are invalid');
    ddmm.relay.initialize();

    ddmm.messages.send(message.channel, 'notification', `No relay exists for channel ${message.channel.id}`);
    return;
  }

  let user = ddmm.relay.channelRelays.get(message.channel.id).user;

  if (name.length > 0) {
    message.channel.setName(name)
      .catch(ddmm.logger.error);
    ddmm.users.profiles.get(user.id).setProperty('name', name);
    ddmm.messages.send(message.channel, 'notification', `Renamed ${user.username} to ${name}!`);
  } else {
    ddmm.messages.send(message.channel, 'notification', `Failed to rename, no name provided.`);
  }

  ddmm.logger.debug(`Renaming ${user.username} to ${name}`);
};