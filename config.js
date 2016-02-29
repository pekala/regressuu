/* eslint-env node */
'use strict';
const DEFAULT_CONFIG = {
    SERVER_PORT: 1358,
    TOLERANCE: 0.05,
    BROWSERS: ['phantomjs', 'chrome'],
};

const logger = require('./logger');
const cosmiconfig = require('cosmiconfig');

module.exports = () => cosmiconfig('regressuu')
    .then(result => {
        logger.log(`Using config from ${result.filepath}`);
        return Object.assign({}, DEFAULT_CONFIG, result.config);
    })
    .catch(parsingError => {
        console.error(parsingError);
        throw parsingError;
    });
