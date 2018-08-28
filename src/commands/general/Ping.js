const Command = require('../../structures/Command');

class Ping extends Command {
  constructor() {
    super();
    this.name = 'ping';
    this.category = 'Miscellaneous';
    this.description = 'Returns the response time between the bot and discord.';
  }

  async execute({ response, processTime, commandProcessTime }) {
    return response.send({
      title: `Response Time`,
      bold: true,
      content: `Pong: \`${Math.floor(response.channel.guild.shard.latency)}ms\`\nMessage processing time: \`${processTime}ms\`\nCommand processing time: \`${(new Date().getTime() - commandProcessTime)}ms\``,
      type: 'success',
      noThumbnail: true
    });
  }
}

module.exports = Ping;
