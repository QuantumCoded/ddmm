const path = require('path');
const fs = require('fs');

const assetsPath = path.join(__dirname, 'assets'); // Where the assets are stored
const assetNames = fs.readdirSync(assetsPath);     // The assets that are stored

// The assets as an array of [name, module]
const assetsMap = assetNames.map(name =>
  [name.replace('.js',''), require(path.join(assetsPath, name))]
);

// Binds a list of event handlers to an event emitter
module.exports.bind = function(eventEmitter) {

  // import.events(eventEmitter); just automatically bind the event

  assetsMap.forEach(asset => {
    eventEmitter.addListener(asset[0], asset[1]);
  });
};