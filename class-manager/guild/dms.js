class DmsGuild {
  general;

  constructor(client) {
    // Create then initalize the client's dms
    client.user.createGuild('D m s').then(dmsGuild => client.initializeDms.bind(client)(dmsGuild))
      .catch(console.error);
  }
}

module.exports = DmsGuild;