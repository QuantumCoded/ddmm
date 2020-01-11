const ddmm = require('ddmm');

module.exports = function(message) {
  ddmm.logger.verbose('Deleting the DMs guild!');

  message.guild.delete();

  //NTS: clear the links map to prevent having to remove them on restart
};