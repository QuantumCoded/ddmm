module.exports = function(options) {
  return {
    content: '',
    options: {
      username: 'Rename',
      embeds: [{
        title: options.new ? 'Rename Successful' : 'Rename Unseccessful',
        description: options.new ? `Changed name of user ${options.old} to ${options.new}` : 'Unable to rename user'
      }]
    }
  };
};