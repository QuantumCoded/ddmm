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
    let profile = ddmm.profiles.get(relay.userId); // Get the user's profile

    // Error out if there is no profile for the user
    if (!profile) {
      ddmm.logger.error('Attempting to change picture of user', relay.user.username, relay.userId, 'failed. (no profile)');
      ddmm.messages.send(message.channel, 'notification', `There was an error while changing the picture!`);

      return;
    }

    // Change the user's profile-picture property
    profile.setProperty('profile-picture', url);
    
    // Alert the user that the user's image updated successfully
    ddmm.logger.debug(`Reimaging ${relay.user.username} with ${url}`);
    ddmm.messages.send(message.channel, 'notification', `Successfully changed the picture for ${profile.getProperty('name')}!`);
  } else {
    // Alert the user that there was an error
    ddmm.messages.send(message.channel, 'notification', `There was an error while changing the picture!`);
  }

  // NTS Include the ability to show a photo in the notification too
    //   For the moment I'm just trying to transfer it all over to a standardized system
};