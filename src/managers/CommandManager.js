const CommandResponse = require('../structures/CommandResponse');
const { readdirSync } = require('fs');
const { resolve } = require('path');

class CommandManager {
  constructor(client) {
    this.client = client;
    this.builtInPrefix = process.env.PREFIX;
    this.commands = {};
  }

  loadCategory(category) {
    if (category.endsWith('.js')) return;
    const files = readdirSync(resolve('./src', 'commands', category));
    files.filter((fileName) => fileName.endsWith('.js')).forEach((fileName) => {
      let command = resolve('./src', 'commands', category, fileName);
      this.loadCommand(command);
    });
  }

  loadCommands() {
    const categories = readdirSync(resolve('./src', 'commands'));
    categories.filter((category) =>
      !category.endsWith('.js') || !category.endsWith('.disabled')
    ).forEach((category) => {
      this.loadCategory(category);
    });
  }

  loadCommand(command) {
    command = require(command); command = new command(this.client);
    this.commands[command.name] = command;
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands._aliases[alias] = command.name;
      });
    }
  }

  unloadCommand(name) {
    delete this.commands[name];
  }

  reloadCommand(name) {
    if (!this.commands[name]) throw new Error('Invalid command');
    let command = this.commands[name];
    this.unloadCommand(name);
    command = require(command.path);
    this.loadCommand(new command(this.client));
  }

  preCheckMessage(message) {
    if (message.content.replace(/<@!/g, '<@').startsWith(`<@${this.client.user.id}> `)) {
      message.prefix = `<@${this.client.user.id}> `;
      return true;
    }
    message.prefix = this.builtInPrefix;
    if (!message.content.startsWith(message.prefix)) return;
    if (message.channel.guild) message.guild = message.channel.guild;
    return message.prefix;
  }

  async processMessage(message) {
    /* eslint max-len: 0, curly: 0 */
    if (!message.prefix) return;
    let processingStartTime = new Date().getTime();
    let commandArguments = message.content.replace(/<@!/g, '<@').substring(message.prefix.length).split(' ');
    let commandName = commandArguments.shift().toLowerCase();
    let command = this.commands[commandName];
    if (message.channel.type === 1 && !command.allowDMUsage) return;
    const Response = new CommandResponse(message, command, commandArguments);
    return command.process({
      response: Response,
      commandArguments,
      command,
      processingStartTime,
    });
  }
}

module.exports = CommandManager;
