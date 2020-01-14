const ddmm = require('ddmm');

const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the profiles path

const profilesPath = path.join(__dirname, 'profiles'); // ./profiles

const profiles = new Map();

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

// Validate and store a profile into the profiles map
const initializeProfile = function(name) {
  let client = ddmm.getClient();

  if (name === '.gitignore') return; // Ignore the .gitignore file

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

// Initialize all the profiles in the profiles directory
module.exports.initialize = function() {
  ddmm.logger.verbose('Initializing user profiles...');

  fs.readdirSync(profilesPath).forEach(initializeProfile);

  ddmm.logger.verbose('Finished!');
};

// Create a profile for a user with custom settings
module.exports.createProfile = function(id, object) {
  let fileName = id + '.json'
  let filePath = path.join(profilesPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(object, true, 2));
  initializeProfile(fileName);
};

module.exports.profiles = profiles;