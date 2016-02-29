/* eslint-env node */
'use strict';

const open = require('open');
const logger = require('./logger');
const updateBaseline = require('./updateBaseline');

module.exports = (app, config) => screenshots => {
    screenshots.forEach(screenshot => {
        if (screenshot.message.indexOf('first image') > -1) {
            logger.star(`${screenshot.componentName}/${screenshot.fixture.name} added as a baseline for ${screenshot.browserName}`);
        } else if (screenshot.message.indexOf('mismatch tolerance not exceeded') > -1) {
            logger.check(`${screenshot.componentName}/${screenshot.fixture.name} has not changed for ${screenshot.browserName}`);
        } else {
            logger.cross(`${screenshot.componentName}/${screenshot.fixture.name} for ${screenshot.browserName} has changed by ${screenshot.misMatchPercentage}%`);
        }
    });

    return new Promise((resolve, reject) => {
        const failedScreenshots = screenshots
            .filter(screenshot => !screenshot.isWithinMisMatchTolerance);

        if(!failedScreenshots.length) {
            logger.log('All tests successful!');
            resolve();
        } else {
            app.get('/diff', function(req, res) {
                res.render('diffApp/index', { screenshots: failedScreenshots });
            });

            app.post('/accept', function(req, res) {
                updateBaseline(failedScreenshots).then(() => {
                    res.end('A OK!');
                    resolve();
                }).catch(error => reject(error));
            });

            open(`http://localhost:${config.SERVER_PORT}/diff`);
        }
    });
};
