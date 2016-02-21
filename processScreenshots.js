const logger = require('./logger');
module.exports = screenshots => {
    screenshots.forEach(screenshot => {
        const fileName = screenshot.baselinePath.split('/')[1].replace('.baseline.png', '');
        if (screenshot.message.indexOf('first image') > -1) {
            logger.star(`${fileName} added as a baseline (new component)`);
        } else if (screenshot.message.indexOf('mismatch tolerance not exceeded') > -1) {
            logger.check(`${fileName} has not changed`);
        } else {
            logger.cross(`${fileName} has changed by ${screenshot.misMatchPercentage}%`);
        }
    });
};
