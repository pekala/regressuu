/* eslint-env node */
'use strict';

const ejs = require('ejs');
const express = require('express');

const selenium = require('./seleniumUtils');
const getFixtures = require('./getFixtures');
const grabScreenshots = require('./grabScreenshots');
const startServer = require('./startServer');
const processScreenshots = require('./processScreenshots');
const getConfig = require('./config');

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', './');
app.use(express.static('./'));

getConfig().then(config => {
    Promise.resolve()
        .then(selenium.install)
        .then(selenium.start)
        .then(startServer(app, config))
        .then(getFixtures(config))
        .then(grabScreenshots(config))
        .then(processScreenshots(app, config))
        .then(selenium.kill)
        .then(() => process.exit())
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
});
