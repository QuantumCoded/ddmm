const ddmm = require('ddmm')

module.exports = function(channel) {
  // If the user stopped typing in a relayable channel then stop typing in the dms
  if (ddmm.relay.channelRelays.has(channel.id)) {
    let dmChannel = ddmm.relay.channelRelays.get(channel.id).dms; // Get the dms channel

    dmChannel.stopTyping(true); // Stop typing in the dms
  }
};