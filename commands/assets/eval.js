const ddmm = require('ddmm');

module.exports = function(message) {
  message.delete()
    .catch(ddmm.logger.error);

  let result;
  let input = message.content.split(' ').slice(1).join(' ');

  try {
    result = eval(input);
  } catch(error) {
    result = error;
  }

  ddmm.messages.send(message.channel, 'evaluation', {input: input, result: result});
};