const ddmm = require('ddmm');

module.exports = function(message) {
  let segments = message.content.split(' ');
  
  if (segments.length < 2) return;


  // NTS Handle parsing the url out with regex in the future please

  let url = message.content.split(' ')[1];
  let relay = ddmm.relay.channelRelays.get(message.channel.id);
  
  // If the url exists then change the users profile picture
  if (url.length > 0) {
    if (ddmm.users.profiles.has(relay.user.id)) {
      ddmm.users.profiles.get(relay.user.id).setProperty('profile-picture', url);
    }
    
    ddmm.logger.debug(`Reimaging ${relay.user.username} with ${url}`);
    ddmm.messages.send(message.channel, 'notification', `Successfully changed the picture for ${relay.displayName}!`);
  } else {
    ddmm.messages.send(message.channel, 'notification', `There was an error while changed picture!`)
  }

  // NTS Include the ability to show a photo in the notification too
    //   For the moment I'm just trying to transfer it all over to a standardized system

  // ddmm.messages.send(message.channel, 'repic', url);
};