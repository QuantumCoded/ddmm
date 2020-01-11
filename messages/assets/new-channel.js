module.exports = function(user) {
  return {
    content: '',
    options: {
      username: 'Info',
      embeds: [{
        title: `**Opened a DM channel with ${user.username}**`,
        description: 'Some information about the user',
        thumbnail: {
          url: user.avatarURL || user.defaultAvatarURL
        }
      }]
    }
  };
};