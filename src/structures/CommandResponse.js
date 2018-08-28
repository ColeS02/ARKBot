const Constants = require('./Constants');

class CommandResponse {
  constructor(message, command) {
    this._message = message;
    this.client = message._client;
    this.command = command;
    this.mergeValues();
  }

  mergeValues() {
    for (const property in this._message) {
      this[property] = this._message[property];
    }
  }

  handleFailedSend(error, message) {
    error = error.toString();
    if (error.includes('Missing Permissions')) {
      return message.author.getDMChannel().then((channel) => channel.createMessage(`You attempted to use the \`${message.command.name}\` command in <#${message.channel.id}> but I do not have permission to send messages in this channel.`)
        .catch(() => null));
    }
  }

  send({ title, content, noThumbnail = true, footer = false, defaultColor = false, noTitle = false, thumbnail, fields = [], type = 'success', custom, bold }) {
    if (custom) return this.channel.createMessage(custom);
    if (bold) content = `**${content}**`;
    if (!thumbnail) thumbnail = {
        name: 'Arkbot',
        icon_url: this.client.user.avatarURL,
    };
    let embed = {
      description: content,
      author: thumbnail,
      color: Constants.COLORS.DARK_GREEN,
      fields,
    };
    if (noThumbnail) delete embed.author;
    if (footer) embed.footer = {
      text: footer
    };
    switch (type) {
      case 'error': {
        if (!noTitle) embed.title = title || 'Error';
        if (!defaultColor) embed.color = Constants.COLORS.RED;
        return this.channel.createMessage({
          embed
        }).catch((error) => this.handleFailedSend(error, this));
      }

      case 'success': {
        if (!noTitle) embed.title = title || 'Success';
        if (!defaultColor) embed.color = Constants.COLORS.GREEN;
        return this.channel.createMessage({
          embed
        }).catch((error) => this.handleFailedSend(error, this));
      }

      case 'warning': {
        if (!noTitle) embed.title = title || 'Warning';
        if (!defaultColor) embed.color = Constants.COLORS.DARK_GOLD;
        return this.channel.createMessage({
          embed
        }).catch((error) => this.handleFailedSend(error, this));
      }
    }
  }
}

module.exports = CommandResponse;
