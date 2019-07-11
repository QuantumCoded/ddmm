const commands = require('./commands'); // Require the list of commands to execute

function Command(message, client) {
  let operators = client.settings.getValue('operators'); // Get the operators from the client's settings
  let command = message.content.replace(operators.command,'').split(' ').shift(); // Remove the command operator off the left and select the first block of text

  // If a command with the name provided exists run the command
  if (commands[command]) {
    commands[command](message, client); // Run the command
  }
}

module.exports = Command;