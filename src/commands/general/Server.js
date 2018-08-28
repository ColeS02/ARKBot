const Command = require('../../structures/Command');
const moment = require('moment');

class ServerInfo extends Command {
  constructor() {
    super();
    this.name = 'info';
    this.category = 'Miscellaneous';
    this.description = 'Fetch server information.\nExample: `!info <server>`';
  }

  async execute({ response, commandArguments, processTime, commandProcessTime }) {
    const fields = [];

    if (commandArguments.length < 1) return response.send({ type: 'error', noTitle: true, content: 'You must include a server number. `!info 1`' });
    if (!response.client.managers.ServerManager.servers[commandArguments[0]]) return response.send({ type: 'error', noTitle: true, content: 'This is not a valid server number.' }); 
    
    const serverData = await response.client.managers.ServerManager.syncServer(commandArguments[0]);
    if (!serverData) return response.send({ type: 'error', noTitle: true, content: 'An error occured while syncing this server. (failed to connect/server offline)' }); 
    if (!serverData.metaCached) return response.send({ type: 'error', noTitle: true, content: 'This server has not been synced yet.' });
    serverData.players.slice(0, 25).forEach(player => {
        fields.push({ inline: true, name: player.name, value: `Connected for: ${moment().seconds(player.duration).fromNow(true)}` })
    });
    
    return response.send({
      title: `${serverData.game}`,
      bold: true,
      content: `Name: ${serverData.name}\nServer #${commandArguments[0]}\nMap: ${serverData.map}\nTotal Players: ${serverData.players.length}/${serverData.maxplayers}\nShowing first 25 players:`,
      type: 'success',
      noThumbnail: true,
      fields,
    });
  }
}

module.exports = ServerInfo;
