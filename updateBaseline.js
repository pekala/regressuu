/* eslint-env node */
'use strict';

const fs = require('fs');
const logger = require('./logger');

module.exports = screenshots => {
    return new Promise(resolve => {
        screenshots.forEach(screenshot => {
            fs.renameSync(screenshot.regressionPath, screenshot.baselineImagePath);
            logger.check(`New baseline saved for ${screenshot.componentName}/${screenshot.fixture.name} (${screenshot.browserName})`);
        });
        logger.log('I do say, jolly good, sir!');
        resolve();
    });
};
