const ddmm = require('ddmm');

// Call the messageUnreact method for messages/index.js
module.exports = function(reaction, user) {
  ddmm.messages.messageUnreact(reaction, user);
}