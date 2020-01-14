const ddmm = require('ddmm');

module.exports = function(message) {
  let nickname, picture;

  if (ddmm.users.profiles.has(message.author.id)) {
    let profile = ddmm.users.profiles.get(message.author.id);

    nickname = profile.getProperty('name');
    picture = profile.getProperty('profile-picture');
  }
  
  return {
    content: message.content,
    options: {
      username: nickname || message.author.username,
      avatarURL: picture || message.author.avatarURL.replace(/\?size=\d+/,'') || message.author.defaultAvatarURL.replace(/\?size=\d+/,''),
      files: Array.from(message.attachments.values()).map(a => a.url)
    }
  };
};