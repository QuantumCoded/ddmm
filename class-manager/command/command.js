const commands = require('./commands');

function Command(message, client) {
  let operators = client.settings.getValue('operators');
  let comman_operator = operators.command;
  let command = message.content.replace(comman_operator,'').split(' ').shift();

  if (commands[command]) {
    commands[command](message, client);
  }
}

module.exports = Command;