const ddmm = require('ddmm');

module.exports = function(message) {
  let name = message.content.split(' ')[1];
  
  if (!ddmm.relay.channelRelays.has(message.channel.id)) {
    ddmm.logger.warn('Attempt to rename a non-relayable channel or relays are invalid');
    ddmm.relay.initialize();
    return;
  }

  let user = ddmm.relay.channelRelays.get(message.channel.id).user;

  if (name.length > 0) {
    message.channel.setName(name)
      .catch(ddmm.logger.error);
    ddmm.users.profiles.get(user.id).setProperty('name', name);
  }

  ddmm.messages.send(message.channel, 'rename-channel', {old: user.username, new: name});

  ddmm.logger.debug(`Renaming ${user.username} to ${name}`);
};