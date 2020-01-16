const ddmm = require('ddmm');

module.exports = function(message) {
  let segments = message.content.split(' ');
  
  if (segments.length < 2) return;


  // NTS: Handle parsing the url out with regex in the future please
    //    Also allow for usage of message attachments

  let url = message.content.split(' ')[1];
  let relay = ddmm.relays.get(message.channel.id);
  
  // If the url exists then change the users profile picture, otherwise alert the user
  if (url.length > 0) {
    // If the user has a profile then change their profile-picture property
    if (ddmm.users.profiles.has(relay.user.id)) {
      ddmm.users.profiles.get(relay.user.id).setProperty('profile-picture', url);
    }
    
    // Alert the user that the user's image updated successfully
    ddmm.logger.debug(`Reimaging ${relay.user.username} with ${url}`);
    ddmm.messages.send(message.channel, 'notification', `Successfully changed the picture for ${relay.displayName}!`);
  } else {
    // Alert the user that there was an error
    ddmm.messages.send(message.channel, 'notification', `There was an error while changing the picture!`)
  }

  // NTS Include the ability to show a photo in the notification too
    //   For the moment I'm just trying to transfer it all over to a standardized system
};