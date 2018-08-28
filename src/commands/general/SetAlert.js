const Command = require('../../structures/Command');

class SetAlert extends Command {
  constructor() {
    super();
    this.name = 'setalert';
    this.category = 'Miscellaneous';
    this.description = 'Set the alert channel.\nExample: `!setalert #alerts`';
  }

  async execute({ commandArguments, response, processTime, commandProcessTime }) {
    let accessRole = response.guild.roles.find(role => role.name == process.env.ACCESS_ROLE);
    if (!accessRole || !response.member.roles.includes(accessRole.id)) return;
    if (commandArguments.length < 1) {
        (await response.client.managers.DataManager.configuration.findById('alert')).update({
            alertChannel: ''
        });
        return response.send({ type: 'warning', noTitle: true, bold: true, content: 'You did not select a channel.\nAlerts have been disabled, to re-enable alerts please include a channel. `!setalert #alerts`' });
    }
    const document = await response.client.managers.DataManager.configuration.findById('alert');
    if (!commandArguments[0].match(/<#(\d+)>/))  return response.send({ type: 'error', noTitle: true, bold: true, content: 'Invalid channel' });
    let channelId = commandArguments[0].match(/<#(\d+)>/)[1];
    await document.update({ alertChannel: channelId });
    return response.send({
      noTitle: true,
      bold: true,
      content: `Alerts will now be sent to <#${channelId}>`,
      type: 'success',
    });
  }
}

module.exports = SetAlert;
