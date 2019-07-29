const users = require('../../users');

module.exports = function(message) {
  let nickname;

  if (users.profiles.has(message.author.id)) nickname = users.profiles.get(message.author.id).getProperty('name');

  return {
    content: message.content,
    options: {
      username: nickname || message.author.username,
      avatarURL: message.author.avatarURL || message.author.defaultAvatarURL
    }
  };
};