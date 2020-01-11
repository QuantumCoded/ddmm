const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the settings file path

const settingsPath = path.join(__dirname, '../settings.json');

const parseSettings = () => JSON.parse(fs.readFileSync(settingsPath, 'utf8'));                     // Reads the current contents of the settings file
const writeSettings = settings => fs.writeFileSync(settingsPath, JSON.stringify(settings,null,2)); // Writes the current settings variable to settings file

// Gets a value out of the users settings
module.exports.getValue = function(name) {
  let settings = parseSettings();
  return settings[name];
};

// Sets a value in the users settings
module.exports.setValue = function(name, value) {
  let settings = parseSettings();
  settings[name] = value;
  writeSettings(settings);
};

// Deletes a value in the users settings
module.exports.delValue = function(name) {
  let settings = parseSettings();
  delete settings[name];
  writeSettings(settings);
};