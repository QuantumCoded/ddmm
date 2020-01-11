const ddmm = require('ddmm');

module.exports = function(message) {
  let segments = message.content.split(' ');
  
  if (segments.length < 2) return;

  let url = message.content.split(' ')[1];
  let user = ddmm.relay.channelRelays.get(message.channel.id).user;

  if (url.length > 0) {
    ddmm.users.profiles.get(user.id).setProperty('profile-picture', url);
  }

  ddmm.messages.send(message.channel, 'repic', url);

  ddmm.logger.debug(`Reimaging ${user.username} with ${url}`);
};