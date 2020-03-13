const ddmm = require('ddmm');

module.exports = function(message) {
  // Split the command at space to isolate the name portion
  let name = message.content.split(' ').slice(1).join(' ');

  // If the relay dosen't exist warn the user and reinitialize the relays
  if (!ddmm.relays.has(message.channel.id)) {
    ddmm.logger.warn('Attempt to rename a non-relayable channel or relays are invalid');
    ddmm.relays.initialize();

    ddmm.messages.send(message.channel, 'notification', `No relay exists for channel ${message.channel.id}`);
    return;
  }

  // Get the user from relays
  let user = ddmm.relays.get(message.channel.id).user;

  // If the name is more than 0 characters, (and less that 80) rename the user, otherwise alert the user that the rename failed
  if (name.length > 0 && name.length < 80) {
    // Rename the channel
    message.channel.setName(name)
      .catch(ddmm.logger.error);

    // Get the user's profile
    let profile = ddmm.profiles.get(user.id);
    
    // Error out if the user has no profile
    if (!profile) {
      ddmm.logger.error('Attempting to change name of user', relay.user.username, relay.userId, 'failed. (no profile)');
      ddmm.messages.send(message.channel, 'notification', `There was an error while changing the name!`);

      return;
    }

    profile.setProperty('name', name);

    // Alert the user that the rename completed
    ddmm.messages.send(message.channel, 'notification', `Renamed ${user.username} to ${name}!`);
  } else {
    let reason;

    if (name.length === 0) reason = 'name must be at least 1 character, 0 were provided';
    if (name.length >= 80) reason = `name must be shorter than 80 characters, ${name.length} were provided`;

    // Alert the user that the rename failed
    ddmm.messages.send(message.channel, 'notification', `Failed to rename, name is invalid. (${reason || 'Fatal Error'})`);
  }

  ddmm.logger.debug(`Renaming ${user.username} to ${name}`);
};