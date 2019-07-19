class DmsGuild {
  general;

  constructor(client) {
    client.log.verbose('Creating a new guild');

    // Create then initalize the client's dms
    client.user.createGuild('D m s').then(guild => client.initializeDms.bind(client)(guild))
      .catch(client.log.error);
  }
}

module.exports = DmsGuild;