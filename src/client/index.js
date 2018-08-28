const Eris = require('eris');
const { CommandManager, EventManager, DataManager, LogManager, ServerManager } = require('../managers');

class Arkbot extends Eris.Client {
  constructor() {
    super(process.env.TOKEN, {
      disableEvents: {
        TYPING_START: true,
        VOICE_STATE_UPDATE: true,
        PRESENCE_UPDATE: true,
      },
      defaultImageFormat: 'webp',
      messageLimit: 1000,
      compress: true,
    });
    this.library = Eris;
    this.managers = {
        LogManager: new LogManager('client', this),
        DataManager: new DataManager(this),
        EventManager: new EventManager(this),
        CommandManager: new CommandManager(this),
        ServerManager: new ServerManager(this),
    };
  }

  start() {
    return this.connect();
  }
}

module.exports = Arkbot;
