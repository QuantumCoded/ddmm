/**
 * Handles setting up and running commands.
 * @module ddmm/commands
 */

const ddmm = require('ddmm');
const Message = require('discord.js').Message;

const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const commands = new Map();

/**
 * Runs a command from its name and a message.
 * @param {string} name The name of the command
 * @param {Message} message The message that issued the command
 * @example
 * ddmm.commands.execute('test', message);
 */
module.exports.execute = function(name, message) {
  // If the command exists in the map
  if (commands.has(name))
    commands.get(name)(message); // Run the command with the message that called it
  else
    ddmm.logger.warn(`Unknown command ${name}`); // Otherwise throw a warning
    
    // NTS: Throw a PossibleImportMissing warning
    //    A request to access the command "command name" has failed. It's possible that the asset is just not initialized
    //    Run !reload <msg|cmd|event|all> to re-initialize the assets that may not have been included
};

/**
 * Loads all the commands into a map so they're ready to use,
 * should be ran before trying to call execute.
 */
module.exports.initialize = function() {
  let assets = fs.readdirSync(assetsPath);

  commands.clear(); // Remove existing commands

  ddmm.import.commands(commands); // Import commands from packages

  // Load core commands
  assets.forEach(asset => {
    let assetPath = path.join(assetsPath, asset);
    commands.set(asset.replace('.js', ''), require(assetPath));
  });
};