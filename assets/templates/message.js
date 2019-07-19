module.exports = function(message) {
  return {
    content: message.content,
    options: {
      username: message.author.username, // NTS: Change to grab nick name here
      avatarURL: message.author.avatarURL
    }
  };
};