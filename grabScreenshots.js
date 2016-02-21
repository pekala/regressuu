const fs = require('fs');
const path = require('path');
const webdriverio = require('webdriverio');
const webdrivercss = require('webdrivercss');

const logger = require('./logger');

const screenshotRoot = '_screenshots';
const failedComparisonsRoot = '_screenshots/_diffs';

module.exports = function (tests) {
    const promises = [];
    const filesToRemove = [];
    const browsers = ['phantomjs'].map(browserName => {
        const browser = {
            name: browserName,
            driver: webdriverio.remote({
                desiredCapabilities: {
                    browserName: browserName,
                },
            }).init(),
        };
        webdrivercss.init(browser.driver, {
            screenshotRoot: screenshotRoot,
            failedComparisonsRoot: failedComparisonsRoot,
            misMatchTolerance: 0.05,
        });
        return browser;
    });


    tests.forEach(function(test) {
        test.fixtures.forEach(function(fixture) {
            const fixtureUrl = `http://localhost:1358?component=${test.name}&fixture=${fixture}&fullScreen=true`;
            const id = [test.name, fixture].join('.');
            const elementSelector = '[class^="component-playground__preview"] > *';
            filesToRemove.push(id + '.png');

            browsers.forEach(browser => {
                const promise = new Promise((resolve, reject) => {
                    browser.driver
                    .url(fixtureUrl)
                    .webdrivercss(id, {
                        name: browser.name,
                        elem: elementSelector,
                    }, (err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        logger.log(`${id} screenshot taken for ${browser.name}`);
                        resolve(res);
                    });
                });
                promises.push(promise);
            });
        });
    });

    return Promise.all(promises).then(results => {
        browsers.forEach(browser => {
            browser.driver.end();
        });
        filesToRemove.forEach(fileName => {
            fs.unlinkSync(path.resolve(__dirname, screenshotRoot, fileName));
        });
        return results.map(result => {
            const browserName = Object.keys(result)[0];
            return Object.assign(result[browserName][0], { browserName: browserName });
        });
    });
};
