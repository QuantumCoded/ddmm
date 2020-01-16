const ddmm = require('ddmm');
const djs = require('discord.js');

module.exports = function(message) {
  // If the channel has a relay remove it, otherwise warn and reinitialize
  if (ddmm.relays.has(message.channel.id)) {
    let relay = ddmm.relays.get(message.channel.id); // The channel's relay

    ddmm.logger.verbose(`Closing channel for user ${relay.user.username}`);

    // Remove the relay
    ddmm.relays.deleteRelay(relay);
  } else {
    ddmm.logger.warn(`Unable to find the relay for channel ${message.channel.id}`);
    ddmm.relays.initialize(); // Reinitialize the relays to remove the bad enteries
  }

  // Delete the channel
  message.channel.delete()
    .catch(ddmm.logger.error);
};