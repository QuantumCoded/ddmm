const ddmm = require('ddmm');

const fs = require('fs');
const path = require('path');

const webhook = require('./webhook');

const assetsPath = path.join(__dirname, 'assets');
const templates = new Map();

// Construct and send a message using the webhook module
module.exports.send = function(channel, name, options) {

  // If the template exists in the map
  if (templates.has(name)) 
    webhook(channel, templates.get(name)(options)); // Create a webhook for the message
  else
    ddmm.logger.warn(`Unknown message template ${name}`); // Otherwise throw a warning
    
    // NTS: Throw a PossibleImportMissing warning
    //    A request to access the message template "template name" has failed. It's possible that the asset is just not initialized
    //    Run !reload <msg|cmd|event|all> to re-initialize the assets that may not have been included
};

// Load the message templates so they're ready to use
module.exports.initialize = function() {
  let assets = fs.readdirSync(assetsPath);

  templates.clear(); // Remove existing message templates

  ddmm.import.messages(templates); // Import message from packages

  // Load core templates
  assets.forEach(asset => {
    let assetPath = path.join(assetsPath, asset);
    templates.set(asset.replace('.js', ''), require(assetPath));
  });
}