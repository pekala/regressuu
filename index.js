/* eslint-env node */
'use strict';

const ejs = require('ejs');
const express = require('express');

const selenium = require('./seleniumUtils');
const getFixtures = require('./getFixtures');
const grabScreenshots = require('./grabScreenshots');
const startServer = require('./startServer');
const processScreenshots = require('./processScreenshots');

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', './');
app.use(express.static('./'));

Promise.resolve()
    .then(selenium.install)
    .then(selenium.start)
    .then(startServer(app))
    .then(getFixtures)
    .then(grabScreenshots)
    .then(processScreenshots(app))
    .then(selenium.kill)
    .then(() => process.exit())
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
