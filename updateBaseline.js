const fs = require('fs');
const logger = require('./logger');

module.exports = screenshots => {
    return new Promise(resolve => {
        screenshots.forEach(screenshot => {
            fs.renameSync(screenshot.regressionPath, screenshot.baselineImagePath);
            logger.check(`New baseline saved for ${screenshot.fileName}`);
        });
        logger.log('I do say, jolly good, sir!');
        resolve();
    });
};
