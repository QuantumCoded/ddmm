const ddmm = require('ddmm');

module.exports = function(message) {
  if (ddmm.relay.channelRelays.has(message.channel.id)) {
    let user = ddmm.relay.channelRelays.get(message.channel.id).user;

    ddmm.logger.verbose(`Closing channel for user ${user.username}`);

    ddmm.relay.deleteRelay(user);
    message.channel.delete()
      .catch(ddmm.logger.error);
  } else {
    ddmm.logger.error(`Unable to find the channel relay for ${message.channel.id}`);
    ddmm.relay.initialize();
  }
};