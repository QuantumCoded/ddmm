module.exports = function(options) {
  return {
    content: '',
    options: {
      username: 'Info',
      avatarURL: 'https://montgomeryplanning.org/wp-content/uploads/2017/08/info-icon.png',
      embeds: [{
        color: 0xff0000,
        title: 'Welcome!',
        description: `Welcome ${options.name} to Jeffrey's DM manager, in order to get started use the command ${options.operator}help`
      }]
    }
  }
};