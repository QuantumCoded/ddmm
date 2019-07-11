class DmsGuild {
  general;

  constructor(client) {
    // Create then initalize the client's dms
    client.user.createGuild('D m s').then(guild => client.initializeDms.bind(client)(guild))
      .catch(console.error);
  }
}

module.exports = DmsGuild;