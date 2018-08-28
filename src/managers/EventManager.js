class EventManager {
  constructor(base) {
    this.base = base;
    this.base.on('connect', this.handleConnect.bind(this));
    this.base.on('hello', this.handleHello.bind(this));
    this.base.on('ready', this.handleReady.bind(this));
    this.base.on('messageCreate', this.handleMessage.bind(this));
  }

  handleConnect(id) {
    return this.base.managers.LogManager.log({
      code: 4,
      message: `Client established connection to gateway`,
    });
  }

  handleHello(trace, id) {
    this.base.gatewayServer = trace;
    return this.base.managers.LogManager.log({
      code: 4,
      message: `Client received HELLO from ${trace}`,
    });
  }

  handleReady() {
    this.base.managers.CommandManager.loadCommands();
    this.base.managers.ServerManager.syncAlertServers();
    return this.base.managers.LogManager.log({
      code: 3,
      message: `Client received READY`,
    });
  }

  async handleMessage(message) {
    if (!this.base.ready) return;
    if (message.author.id === this.base.user.id || message.author.bot) return;
    if (!this.base.managers.CommandManager.preCheckMessage(message)) return;
    return this.base.managers.CommandManager.processMessage(message);
  }
}

module.exports = EventManager;
