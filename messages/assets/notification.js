module.exports = function(message) {
  return {
    options: {
      username: 'Notification',
      embeds: [{
        title: 'Notification',
        description: message
      }]
    }
  };
};