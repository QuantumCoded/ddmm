const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the profiles path

// The class of a user's profile
class Profile {
  path;
  object;

  constructor(name) {
    this.path = path.join(profiles_path, name); // Save the user's file path
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

const profiles_path = path.join(__dirname, 'profiles'); // ./profiles
const profile_files = fs.readdirSync(profiles_path); // An array of all the files in the profiles folder
const profiles_iterable = profile_files.map(name => [name.replace('.json',''), new Profile(name)]); // Create the iterator for the profiles

const profiles = new Map(profiles_iterable); // A map of Profiles<id, profile>

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
  let user_path = path.join(profiles_path, id + '.json');
  fs.writeFileSync(user_path, JSON.stringify(object));
};