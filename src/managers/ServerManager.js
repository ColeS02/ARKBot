const { readFileSync } = require('fs');
const { resolve } = require('path');
const query = function() {
  return require('source-server-query');
};

class ServerManager {
  constructor(client) {
    this.client = client;
    this.servers = {};
    
    this.loadServers();
    this.interval = setInterval(() => {
      this.syncAlertServers();
    }, 10000)
  }


  loadServers() {
    let serverList = readFileSync(resolve('.servers'), 'utf8').split('\n');
    serverList.forEach(server => {
      const split = server.split(':');
      this.servers[parseInt(split[3])] = { name: split[0], address: split[1], port: parseInt(split[2]) };
    });
  }

  async syncAlertServers() {
    let configuration = await this.client.managers.DataManager.configuration.findById('alert');
    if (configuration.alertChannel == '') return;
    let guild = this.client.guilds.find(guild => guild.channels.get(configuration.alertChannel));
    if (!guild) return;
    let channel = guild.channels.get(configuration.alertChannel);
    
    return this.client.managers.DataManager.servers.forEach(async document => {
      if (!document.alerts) return;
      const server = await this.syncServer(document._id);
      if (!server) return;
      if (!document.alerted && server.players.length >= document.threshold) {
        await document.update({ alerted: true });
        return channel.createMessage({ content: `@here: Server #${document._id} has reached over \`${document.threshold}\` players`, disableEveryone: false });
      } else if (document.alerted && server.players.length < document.threshold) {
        await document.update({ alerted: false });
        return channel.createMessage({ content: `@here: Server #${document._id} is now below \`${document.threshold}\` players`, disableEveryone: false });
      }      
    })
  }

  async syncServer(serverNumber) {
    const server = this.servers[serverNumber];
    if (this.servers[serverNumber].metaCached) {
        const players = await this.fetchPlayers(serverNumber);
        if (!players) return server;
        server.players = players;
        this.servers[serverNumber] = server;
        return server
    };
    const metadata = await this.fetchServerInfo(serverNumber);
    const players = await this.fetchPlayers(serverNumber);
    if (!metadata || !players) return;
    Object.entries(metadata).forEach(([key, value]) => {
      if (key == 'port') return;
      server[key] = value
    });
    server.metaCached = true;
    server.players = players;
    this.servers[serverNumber] = server;
    this.client.managers.LogManager.log({
      code: 2,
      message: `Doing initial sync server #${serverNumber}... (auto-sync-enabled)`,
    });
    return server;
  }

  async fetchPlayers(serverNumber) {
    const server = this.servers[serverNumber];
    try {
      let players = await query().players(server.address, server.port);
      if (!players) return;
      return players.filter(player => player.name.length > 1);
    } catch (error) {
      this.client.managers.LogManager.log({
        code: 1,
        debug: true,
        message: `Couldn't sync players for Server #${serverNumber}, are you running the command too fast? This is a Steam error, usually it will resolve within 2-5 minutes.`,
      });
      return false
    }
  }
  
  async fetchServerInfo(serverNumber) {
    const server = this.servers[serverNumber];
    try {
      let serverData = await query().info(server.address, server.port);
      if (serverData.errno) return false;
      return serverData;
    } catch(error) {
      this.client.managers.LogManager.log({
        code: 1,
        message: `Couldn't sync metadata for Server #${id}, is the server online? (failed to connect)`,
      });
      return false
    }
  }
}

module.exports = ServerManager;
