/* eslint-env node */
'use strict';

var ProgressBar = require('progress');
const selenium = require('selenium-standalone');
const logger = require('./logger');
let seleniumChild;

const seleniumSettings = {
    version: '2.52.0',
    drivers: {
        chrome: {
            version: '2.9',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com',
        },
    },
};

module.exports.install = () => new Promise((resolve, reject) => {
    let bar;
    logger.log('Downloading Selenium');
    selenium.install(Object.assign({}, seleniumSettings, {
        baseURL: 'https://selenium-release.storage.googleapis.com',
        progressCb: (totalLength, progressLength, chunkLength) => {
            bar = bar || new ProgressBar('  downloading Selenium [:bar] :percent :etas', {
                complete: ' 🐴 ',
                incomplete: ' 🌾 ',
                width: 20,
                total: totalLength,
            });
            bar.tick(chunkLength);
        },
    }), err => {
        if (err) {
            logger.error('Downloading Selenium failed :(');
            reject(err);
            return;
        }
        logger.log('Selenium Downloaded');
        resolve();
    });
});

module.exports.start = () => new Promise((resolve, reject) => {
    logger.log('Starting Selenium');
    selenium.start(Object.assign({}, seleniumSettings, {
        // spawnOptions: {
        //     stdio: 'inherit',
        // },
    }), (err, child) => {
        if (err) {
            logger.error('Starting Selenium failed :(');
            reject(err);
            return;
        } else {
            logger.log('Selenium Started');
            seleniumChild = child;
            resolve();
        }
    });
});

module.exports.kill = () => seleniumChild.kill();
