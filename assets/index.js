const fs = require('fs'); // Require the fs module to access files on the computer
const path = require('path'); // Require the path module to get locations of files

const commands_path = path.join(__dirname, 'commands');   // ./commands
const templates_path = path.join(__dirname, 'templates'); // ./templates
const command_files = fs.readdirSync(commands_path);   // An array of all the files in the commands folder
const template_files = fs.readdirSync(templates_path); // An array of all the files in the templates folder
const commands_iterable = command_files.map(name => [name.replace('.js',''), require(path.join(commands_path, name))]);    // Create the iterator for the commands
const templates_iterable = template_files.map(name => [name.replace('.js',''), require(path.join(templates_path, name))]); // Create the iterator for the templates

const commands = new Map(commands_iterable);   // A map of Command<name, function(message, client)>
const templates = new Map(templates_iterable); // A map of Template<name, function(options)>

// NTS: Change the returning without success to logging a warning when the logger is its own class

// Run a command with its name and a message
module.exports.runCommand = function(name, message, client) {
  // If the command exists run it otherwise return without success
  if (commands.has(name)) {
    commands.get(name)(message, client);
    return true;
  } else return;
};

// Generate a template with its name and options
module.exports.getTemplate = function(name, options) {
  // If the template exists create it otherwise return without success
  if (templates.has(name)) return templates.get(name)(options);
  else return;
};