const ddmm = require('ddmm')

module.exports = function(channel) {
  // If the user is typing in a relayable channel then start typing in the dms
  if (ddmm.relay.channelRelays.has(channel.id)) {
    let dmChannel = ddmm.relay.channelRelays.get(channel.id).dms; // Get the dms channel

    dmChannel.startTyping(); // Start typing in the dms
  }
};