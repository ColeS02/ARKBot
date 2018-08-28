/* eslint no-console: 0 */
const chalk = require('chalk');
const { Constants } = require('../structures');

class LogManager {
  constructor(type, base) {
    this.base = base;
    this.type = type;
  }

  log({ message = 'No message provided.', code = 1, debug = false, options = { title: 'Log Manager', errorTitle: 'Generic' } }) {
    if (debug && !process.env.DEBUG_MODE) return;
    let endMessage = chalk.cyan.bold(`\n<${'-'.repeat(30)}>\n`);
    if (typeof message === 'object') message = require('util').inspect(message);
    message = message.replace((new RegExp(this.base.token, 'g')), '[redacted:security-violation]');

    switch (code) {
      case Constants.LOG_CODES.READY: {
        let statistics = `\t
        ${chalk.white('Client User: ')}${chalk.green(`${this.base.user.username}#${this.base.user.discriminator}`)}
        ${chalk.white('Guilds: ')}${chalk.green(this.base.guilds.size)}
        ${chalk.white('Users: ')}${chalk.green(this.base.users.size)}`;
        message = `${endMessage}${chalk.yellow.bold(`[CLIENT/EVENTS/READY]: `)}\n${statistics}${endMessage}`;
        return console.log(message);
      }

      case Constants.LOG_CODES.CONNECT: {
        message = `${endMessage}${chalk.yellow.bold(`[CLIENT/CONNECTION]: `)}\n\n${message}${endMessage}`;
        return console.log(message);
      }

      case Constants.LOG_CODES.DEBUG: {
        message = `${endMessage}${chalk.yellow.bold(`[CLIENT/DEBUG]: `)}\n\n${message}${endMessage}`;
        return console.log(message);
      }

      case Constants.LOG_CODES.GENERIC: {
        message = `${endMessage}${chalk.yellow.bold(`[CLIENT/${options.title}]: `)}\n\n${message}${endMessage}`;
        return console.log(message);
      }

      case Constants.LOG_CODES.ERROR: {
        message = `${endMessage}${chalk.yellow.bold(`[CLIENT/${chalk.red.bold('ERROR')}/${options.errorTitle}]: `)}\n\n${chalk.bgRed(message)}${endMessage}`;
        return console.log(message);
      }

      default:
        console.log(`${endMessage}${chalk.yellow.bold('[CLIENT/LOGGER]: ')}\n\n${chalk.cyan.bold('none')}${endMessage}`);
    }
  }
}

module.exports = LogManager;
