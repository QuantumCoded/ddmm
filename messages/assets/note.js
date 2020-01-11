module.exports = function(content) {
  let colors = [0xc9ecf8, 0xc5f7c1, 0xf1c3f1, 0xd4cdf3, 0xf8f7b6];
  let color = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    content: '',
    options: {
      username: 'Sticky Notes',
      embeds: [{
        title: 'Note',
        color: color,
        description: content
      }]
    }
  };
};