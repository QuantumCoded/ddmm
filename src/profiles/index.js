/**
 * Profiles module
 * @module ddmm/profiles
 */

const ddmm = require('ddmm');

const fs = require('fs'); // Require fs to access files on the local machine
const path = require('path'); // Require the path module to reference the profiles path

const profilesPath = path.join(__dirname, 'users'); // ./users
// NTS: Later this should be a sqlite3 database!

/**
 * The class of a user's profile
 */ 
class Profile {

  /**
   * Creates a profile for a user.
   * @param {string} name The name of the user's profile
   */
  constructor(name) {
    this.path = path.join(profilesPath, name); // Save the user's file path
    this.object = JSON.parse(fs.readFileSync(this.path, 'utf8')); // Parse the user object
  }

  /**
   * Gets a property from the user's profile.
   * @param {string} name The name of the property to get
   * @returns {any} The value of the profile's property
   */
  getProperty(name) {
    return this.object[name]; 
  }

  /**
   * Sets a property of the user's profile.
   * @param {string} name The name of the property to set
   * @param {any} value The value to set the property to
   */
  setProperty(name, value) {
    this.object[name] = value;
    fs.writeFileSync(this.path, JSON.stringify(this.object, true, 2));
  }

  /**
   * Removes a property form a user's profile.
   * @param {string} name The name of the property to remove
   */
  delProperty(name) {
    delete this.object[name];
    fs.writeFileSync(this.path, JSON.stringify(this.object, true, 2));
  }
}

/**
 * The map containing all the profiles with some extra functionality for modifying them.
 * @extends Map
 */
class Profiles extends Map {
  /**
   * The method for validating and storing a profile into the profiles map.
   * @param {string} name The name of the user's profile
   */
  _initializeProfile(name) {
    let client = ddmm.getClient();
  
    if (name === '.gitignore') return; // Ignore the .gitignore file
  
    let id = name.replace('.json',''); // The user's id
  
    // Validate the user
    if (client.users.has(id)) {
      this.set(id, new Profile(name)); // Add the profile to the map
      ddmm.logger.debug(`Loaded profile for ${client.users.get(id).username}`);
    } else {
      ddmm.logger.warn(`Invalid profile ${name} removing file`);
      fs.unlinkSync(path.join(profilesPath, name)); // Delete profile if it's invalid
    }
  };

  /**
   * Initializes all the profiles in the profiles directory.
   */
  initialize() {
    ddmm.logger.verbose('Initializing user profiles...');

    fs.readdirSync(profilesPath).forEach(name => this._initializeProfile(name));

    ddmm.logger.verbose('Finished!');
  };

  /**
   * Create a profile for a user with custom settings.
   * @param {string} id The id of the user to create the profile for
   * @param {Object} object The initial value of the user's profile
   */
  createProfile(id, object) {
    let fileName = id + '.json'
    let filePath = path.join(profilesPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(object, true, 2));
    this._initializeProfile(fileName);
  };
}

/**
 * A map of all the user's profiles
 * @type Profiles
 */
module.exports = new Profiles();