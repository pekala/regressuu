/* eslint-env node */
const path = require('path');
const express = require('express');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const logger = require('./logger');
const webpackConfig = require('./webpack.config');
const createComponentTreeJSON = require('./createComponentTreeJSON');
const grabScreenshots = require('./grabScreenshots');
const port = 1358;

webpackConfig.plugins = [
    new WebpackOnBuildPlugin(function() {
        mkdirp.sync('_screenshots');
        logger.log('component tree generating', 'components');
        createComponentTreeJSON().then(grabScreenshots);
    }),
];

const compiler = webpack(webpackConfig);
const app = express();

app.use(require('webpack-dev-middleware')(compiler, { noInfo: true }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, 'localhost', function(serverError) {
    if (serverError) {
        logger.log(serverError);
        return;
    }
});
