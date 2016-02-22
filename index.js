/* eslint-env node */
'use strict';

const ejs = require('ejs');
const express = require('express');

const selenium = require('./seleniumUtils');
const createComponentTreeJSON = require('./createComponentTreeJSON');
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
    .then(createComponentTreeJSON)
    .then(grabScreenshots)
    .then(processScreenshots(app))
    .then(selenium.kill)
    .then(() => process.exit())
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
