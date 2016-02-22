/* eslint-env node */
'use strict';

const chalk = require('chalk');

const log = (message, id) => {
    console.log(chalk.blue('[regressuu] ') + (id ? chalk.green(`[${id}] `) : '') + message);
};

const check = message => {
    console.log(chalk.blue('[regressuu] ') + chalk.green('✓ ') + message);
};

const cross = message => {
    console.log(chalk.blue('[regressuu] ') + chalk.red('✘ ') + message);
};

const star = message => {
    console.log(chalk.blue('[regressuu] ') + chalk.yellow('★ ') + message);
};

const error = message => {
    console.log(chalk.red('[regressuu] ') + message);
};

module.exports = { log, error, check, cross, star };
