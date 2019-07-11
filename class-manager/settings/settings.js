const fs = require('fs');

class Settings {
  path;
  values;

  constructor(path) {
    this.path = path;
    this.values = JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  getValue(name) {
    return this.values[name];
  }

  setValue(name, value) {
    return this.values[name] = value;
  }

  deleteValue(name) {
    delete this.values[name];
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.values))
  }
}

module.exports = Settings;