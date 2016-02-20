const chalk = require('chalk');

const log = (message, id) => {
    console.log(chalk.blue('[regressuu] ') + (id ? chalk.green(`[${id}] `) : '') + message);
};

const error = message => {
    console.log(chalk.red('[regressuu] ') + message);
};

module.exports = { log, error };
