const logger = require('../../utility/logger');

class DmsGuild {
  general;

  constructor(client) {
    logger.verbose('Creating a new guild');

    // Create then initalize the client's dms
    client.user.createGuild('D m s').then(guild => client.initializeDms.bind(client)(guild))
      .catch(logger.error);
  }
}

module.exports = DmsGuild;