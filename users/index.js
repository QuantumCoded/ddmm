const ddmm = require('ddmm');

const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the profiles path

// The class of a user's profile
class Profile {
  path;
  object;

  constructor(name) {
    this.path = path.join(profilesPath, name); // Save the user's file path
    this.object = JSON.parse(fs.readFileSync(this.path, 'utf8')); // Parse the user object
  }

  // Get a property from the user's object
  getProperty(name) {
    return this.object[name]; 
  }

  // Set a property of the user's object
  setProperty(name, value) {
    this.object[name] = value;
    fs.writeFileSync(this.path, JSON.stringify(this.object, true, 2));
  }

  // Delete a property from the user
  delProperty(name) {
    delete this.object[name];
    fs.writeFileSync(this.path, JSON.stringify(this.object, true, 2));
  }
}

const profilesPath = path.join(__dirname, 'profiles'); // ./profiles
const users = fs.readdirSync(profilesPath);

const profiles = new Map(); // Map<id, profile>

// Validate and create a profile from a user file
const initializeUser = function(name) {
  const client = require('../index');

  let id = name.replace('.json',''); // The user's id

  // Validate the user
  if (client.users.has(id)) {
    profiles.set(id, new Profile(name)); // Add the profile to the map
    ddmm.logger.debug(`Loaded profile for ${client.users.get(id).username}`);
  } else {
    ddmm.logger.warn(`Invalid profile ${name} removing file`);
    fs.unlinkSync(path.join(profilesPath, name)); // Delete profile if it's invalid
  }
};

module.exports.initialize = function() {
  ddmm.logger.verbose('Initializing user profiles...');
  users.forEach(initializeUser);
  ddmm.logger.verbose('Finished!');
};

module.exports.createProfile = function(id, object) {
  let fileName = id + '.json'
  let filePath = path.join(profilesPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(object, true, 2));
  initializeUser(fileName);
};

module.exports.profiles = profiles;