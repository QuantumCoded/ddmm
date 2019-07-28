const Users = require('../../users');

module.exports = function(message) {
  let name;

  if (Users.userExists(message.author.id))  {
    name = Users.getUser(message.author.id).getProperty('name');
  } else name = message.author.username;

  return {
    content: message.content,
    options: {
      username: name,
      avatarURL: message.author.avatarURL || message.author.defaultAvatarURL
    }
  };
};