const ddmm = require('ddmm');

module.exports = function(options) {
  return {
    options: {
      username: 'Reactable',
      embeds: [{
        title: `Select an option`,
        description: `${options.emojis.map((emoji, i) => {
          return `<:${emoji.identifier}> ${options.prompts[i]}`;
        }).join('\r\n')}`
      }]
    }
  };
}