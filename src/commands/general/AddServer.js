const Command = require('../../structures/Command');
const Constants = require('../../structures/Constants');
const { appendFileSync } = require('fs');
const { resolve } = require('path');

class AddServer extends Command {
  constructor() {
    super();
    this.name = 'addserver';
    this.description = 'Add a server';
    this.category = 'Miscellaneous';
  }

  async execute({ commandArguments, response, formattedArguments, commandProcessTime }) {
    let accessRole = response.guild.roles.find(role => role.name == process.env.ACCESS_ROLE);
    if (!accessRole || !response.member.roles.includes(accessRole.id)) return;
    if (commandArguments.length < 2) return response.send({ type: 'error', noTitle: true, bold: true, content: 'Correct usage: `!addserver <serverIP:port> <serverNumber>`\n`!addserver 1.1.1.1:1234 20`' });
    appendFileSync(resolve('.servers'), `\nUnknown:${commandArguments[0]}:${commandArguments[1]}`, 'utf8');
    let split = commandArguments[0].split(':');
    response.client.managers.ServerManager.servers[parseInt(commandArguments[1])] = { name: 'Unknown', address: split[0], port: parseInt(split[1]), rconPort: 27015 };
    return response.send({
        noTitle: true,
        bold: true,
        content: `Successfully added Server #${commandArguments[1]} to the server list.\nPlease allow 10 seconds for the server to sync.`,
        type: 'success',
      });
  }
}

module.exports = AddServer;
