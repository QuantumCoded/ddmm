const path = require('path');
const fs = require('fs');

const importsPath = path.join(__dirname, '../../imports');

const getModules = function() {
  return fs.readdirSync(importsPath);
};

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

module.exports.events = function() {

};