const ddmm = require('ddmm');

// This is a basic command just to illustrate the format for creating a reactable message
module.exports = function(message) {
  ddmm.logger.debug('Sending reactable message');

  let emojiNames = ['xbutton','circlebutton','trianglebutton', 'squarebutton'];
  let reactions = emojiNames.map(name => {
    return [...message.guild.emojis.filter(emoji => emoji.name === name).values()][0]; // Get the first emoji with a matching name in the message's guild
  });

  ddmm.messages.send(
    message.channel,
    'reactable',
    {
      emojis: reactions,
      prompts: ['a','b','c','d']
    },

    function(message) {
      ddmm.logger.debug(`Making message ${message.id} reactable.`);

      ddmm.messages.makeReactable(message, reactions, function(result) {
        ddmm.logger.debug(`Message ${message.id} got reaction ${result}`);

        switch(result) {
          case -1:
            ddmm.messages.send(message.channel, 'notification', 'You let the reactable time out');
          break;

          default:
            ddmm.messages.send(message.channel, 'notification', `You selected ${result}`);
          break;
        }
      });
    }
  );
};