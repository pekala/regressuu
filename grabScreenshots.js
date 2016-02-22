/* eslint-env node */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const webdriverio = require('webdriverio');
const webdrivercss = require('webdrivercss');

const config = require('./config');
const logger = require('./logger');

const screenshotRoot = '_screenshots';
const failedComparisonsRoot = '_screenshots/_diffs';

module.exports = tests => {
    const promises = [];
    const browsers = config.BROWSERS.map(browserName => {
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
            misMatchTolerance: config.TOLERANCE,
        });
        return browser;
    });


    tests.forEach(test => {
        test.fixtures.forEach(fixture => {
            const fixtureUrl = `http://localhost:1358?component=${test.name}&fixture=${fixture.name}&fullScreen=true`;
            const id = [test.name, fixture.name].join('.');
            const elementSelector = '[class^="component-playground__preview"] > *';

            browsers.forEach(browser => {
                let isNew = false;
                const baselineImageName = [fixture.name, browser.name, 'png'].join('.');
                const baselineImagePath = path.resolve(__dirname, './example/fixtures', path.dirname(fixture.path), baselineImageName);
                const tempBaselineImageName = [test.name, fixture.name, browser.name, 'baseline.png'].join('.');
                try {
                    fs.copySync(baselineImagePath, path.resolve(__dirname, screenshotRoot, tempBaselineImageName));
                } catch (e) {
                    isNew = true;
                }


                const promise = new Promise((resolve, reject) => {
                    browser.driver
                    .url(fixtureUrl)
                    .webdrivercss(id, {
                        name: browser.name,
                        elem: elementSelector,
                    }, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        logger.log(`${id} screenshot taken for ${browser.name}`);
                        if (isNew) {
                            fs.renameSync(result[browser.name][0].baselinePath, baselineImagePath);
                        }
                        resolve(Object.assign(result[browser.name][0], {
                            browserName: browser.name,
                            fixture: fixture,
                            componentName: test.name,
                            baselineImagePath: baselineImagePath,
                            baselineImageName: baselineImageName,
                        }));
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
        return results;
    });
};
