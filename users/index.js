const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the profiles path
const logger = require('../utility/logger');

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
    fs.writeFileSync(this.path, JSON.stringify(this.object));
  }

  // Delete a property from the user
  delProperty(name) {
    delete this.object[name];
    fs.writeFileSync(this.path, JSON.stringify(this.object));
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
    logger.debug(`Loaded profile for ${client.users.get(id).username}`);
  } else {
    logger.warn(`Invalid profile ${name} removing file`);
    fs.unlinkSync(path.join(profilesPath, name)); // Delete profile if it's invalid
  }
};

module.exports.initialize = function() {
  logger.debug('Initializing user profiles...');
  users.forEach(initializeUser);
  logger.debug('Finished!');
};

module.exports.createProfile = function(id, object) {
  let fileName = id + '.json'
  let filePath = path.join(profilesPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(object));
  initializeUser(fileName);
};

module.exports.profiles = profiles;

/* 
// Get a user from their id
module.exports.getUser = function(id) {
  if (profiles.has(id)) {
    return profiles.get(id);
  } // Else throw error
};

// Get a user from their channel id
module.exports.getChannelRecipient = function(id) {
  let users = Array.from(profiles.values());
  return users.find(user => user.object.channel == id);
};

// Create a new user with an id and settings
module.exports.createUser = function(id, object) {
  let file_name = id + '.json';
  let user_path = path.join(profiles_path, file_name);
  fs.writeFileSync(user_path, JSON.stringify(object || {}));
  profiles.set(id, new Profile(file_name));
};

// Check if a user exists in the profiles map
module.exports.userExists = (id) => profiles.has(id); */