module.exports = function(url) {
  return {
    content: '',
    options: {
      username: 'Repicture',
      embeds: [{
        title: url ? 'Repicture Successful' : 'Repicture Unseccessful',
        description: url ? `Changed image of user` : 'Unable to reimage user',
        thumbnail: {
          url: url
        }
      }]
    }
  };
};