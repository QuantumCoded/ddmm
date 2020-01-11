const path = require('path');
const fs = require('fs');

const assetsPath = path.join(__dirname, 'assets'); // Where the assets are stored
const assetNames = fs.readdirSync(assetsPath);     // The assets that are stored

// The assets as an array of [name, module]
const assetsMap = assetNames.map(name =>
  [name.replace('.js',''), require(path.join(assetsPath, name))]
);

module.exports.bind = function(eventEmiter) {

  // import.events(eventEmiter); just automatically bind the event

  assetsMap.forEach(asset => {
    eventEmiter.addListener(asset[0], asset[1]);
  });
};