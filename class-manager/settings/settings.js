const fs = require('fs'); // Require fs to access files on the local machine

class Settings {
  path;
  values;

  constructor(path) {
    this.path = path; // Store the path as a class property
    this.values = JSON.parse(fs.readFileSync(path, 'utf8')); // Store the settings as a parsed JSON object
  }

  // Get the value of a setting with its name
  getValue(name) {
    return this.values[name];
  }

  // Set the value of a setting with its name and a new value
  setValue(name, value) {
    return this.values[name] = value;
  }

  // Delete a value out of settings
  deleteValue(name) {
    delete this.values[name];
  }

  // Write the settings to a file
  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.values));
  }
}

module.exports = Settings;