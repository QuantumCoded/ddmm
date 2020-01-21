/**
 * Import module
 * @module ddmm/utility/import
 */

const path = require('path');
const fs = require('fs');

const importsPath = path.join(__dirname, '../../imports');

const getModules = function() {
  return fs.readdirSync(importsPath);
};

/**
 * Imports commands from packages into a map.
 * @param {Map} map The map to import commands into
 */
module.exports.commands = function(map) {
  let packages = getPackages();

  packages.forEach(pkg => {
    if (pkg === '.gitignore') return; // Ignore the .gitignore

    // NTS: Change this to later only accept directories and ignore all files

    let packagePath = path.join(importsPath, pkg);
    let imports = fs.readdirSync(packagePath);

    if (imports.includes('commands')) {
      let resourceDir = path.join(packagePath, 'commands');

      fs.readdirSync(resourceDir).forEach(resource => {
        let resourcePath = path.join(resourceDir, resource);

        // NTS: ensure that the file ends with .js
        map.set(resource.replace('.js', ''), require(resourcePath));
      });
    }
  });
};

/**
 * Imports message templates from packages into a map.
 * @param {Map} map The map to import message templates into
 */
module.exports.messages = function(map) {
 let packages = getPackages();

  packages.forEach(pkg => {
    if (pkg === '.gitignore') return; // Ignore the .gitignore

    // NTS: Change this to later only accept directories and ignore all files

    let packagePath = path.join(importsPath, pkg);
    let imports = fs.readdirSync(packagePath);

    if (imports.includes('messages')) {
      let resourceDir = path.join(packagePath, 'messages');

      fs.readdirSync(resourceDir).forEach(resource => {
        let resourcePath = path.join(resourceDir, resource);

        // NTS: ensure that the file ends with .js
        map.set(resource.replace('.js', ''), require(resourcePath));
      });
    }
  });
};

// NTS: Either remove this or use it at some point
module.exports.events = function() {

};