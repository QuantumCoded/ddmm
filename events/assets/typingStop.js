const ddmm = require('ddmm')

module.exports = function(channel) {
  // If the user stopped typing in a relayable channel then stop typing in the dms
  if (ddmm.relays.has(channel.id)) {
    let dmChannel = ddmm.relays.get(channel.id).dms; // Get the dms channel

    dmChannel.stopTyping(true); // Stop typing in the dms
  }
};