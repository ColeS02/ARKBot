const Command = require('../../structures/Command');

class Alert extends Command {
  constructor() {
    super();
    this.name = 'alerts';
    this.category = 'Miscellaneous';
    this.description = 'Server alerts.\nExample: `!alerts <server> <amountOfPlayers or disable>`';
  }

  async execute({ commandArguments, response, processTime, commandProcessTime }) {
    if (commandArguments.length < 2)
        return response.send({ type: 'error', noTitle: true, bold: true, content: 'Correct usage: `!alert <server> <players|disable>`' });
    if (commandArguments[1] == 'disable') {
        const document = await response.client.managers.DataManager.servers.findById(parseInt(commandArguments[0]));
        if (!document) return response.send({ type: 'error', noTitle: true, bold: true, content: 'This server number does not have any alerts enabled.`' });
        await document.update({ alerts: false });
        return response.send({ type: 'success', noTitle: true, bold: true, content: `Alerts for Server #${commandArguments[0]} have been disabled.` });
    }
    const document = await response.client.managers.DataManager.insertServer(parseInt(commandArguments[0]), {
        threshold: parseInt(commandArguments[1]),
        alerts: true
    });
    return response.send({ type: 'success', noTitle: true, bold: true, content: `You will now recieve an alert when Server #${commandArguments[0]} goes above ${commandArguments[1]} players.` });
    }
}

module.exports = Alert;
