const Command = require('../../structures/Command');
const Constants = require('../../structures/Constants');

class Help extends Command {
  constructor() {
    super();
    this.name = 'help';
    this.description = 'Provides a list of commands and other information';
    this.category = 'Miscellaneous';
  }

  async execute({ response, formattedArguments, commandProcessTime }) {
    let commandString = '';
    let categories = {};
    Object.keys(response.client.managers.CommandManager.commands).forEach(command => {
      command = response.client.managers.CommandManager.commands[command];
      if(!categories[command.category]) categories[command.category] = '';
      categories[command.category] += `\n**${command.name}:** ${command.description}`;
    });
    let embed = {
      author: {
        name: response.client.user.username,
        icon_url: response.client.user.avatarURL
      },
      color: Constants.COLORS.DARK_GREEN,
      description: `This will show accessible commands and other information.`,
      fields: [],
    };
    Object.keys(categories).forEach(category => {
      embed.fields.push({name: `${category}`, value: categories[category], inline: true})
    });
    response.author.getDMChannel().then(channel => {
        channel.createMessage({embed}).then(() => {
            if(!response.channel.recipient) return response.send({content: 'Check your Direct Messages for a list of commands.'})
        }).catch(() => {
          response.channel.createMessage({embed})
        })
    })
  }
}

module.exports = Help;
