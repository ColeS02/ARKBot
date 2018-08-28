const Warehouse = require('warehouse');
const { resolve } = require('path');

class DataManager {
  constructor(client) {
    this.client = client;
    this.base = new Warehouse({ path: resolve('.data') });
    this.base.load();
    this.servers = this.base.model('servers', {
        _id: Number,
        alerts: Boolean,
        threshold: Number,
        alerted: Boolean,
    });
    this.configuration = this.base.model('configuration', {
        _id: String,
        alertChannel: String
    });
    this.configuration.insert({ _id: 'alert', alertChannel: '' });

    setInterval(() => {
        this.base.save()
    }, 5000)
  }

  async insertServer(_id, data) {
    if ((await this.servers.findById(_id))) return await this.servers.updateById(_id, data);
    return await this.servers.insert({
        _id,
        alerts: data.alerts || false,
        threshold: data.threshold || 30
    })
  };

  async updateServer(id, data) {
      return await this.servers.updateById(id, data);
  }
}

module.exports = DataManager;
