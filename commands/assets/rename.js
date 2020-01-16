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

  // If the name is more than 0 characters, rename the user, otherwise alert the user that the rename failed
  if (name.length > 0) {
    // Rename the channel
    message.channel.setName(name)
      .catch(ddmm.logger.error);

    // Rename the user's profile
    ddmm.profiles.get(user.id).setProperty('name', name);

    // Alert the user that the rename completed
    ddmm.messages.send(message.channel, 'notification', `Renamed ${user.username} to ${name}!`);
  } else {
    // Alert the user that the rename failed
    ddmm.messages.send(message.channel, 'notification', `Failed to rename, no name provided.`);
  }

  ddmm.logger.debug(`Renaming ${user.username} to ${name}`);
};