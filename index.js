/* eslint-env node */
const ejs = require('ejs');
const path = require('path');
const express = require('express');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const logger = require('./logger');
const webpackConfig = require('./webpack.config');
const createComponentTreeJSON = require('./createComponentTreeJSON');
const grabScreenshots = require('./grabScreenshots');
const processScreenshots = require('./processScreenshots');
const port = 1358;

const app = express();
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', './');
app.use(express.static('./'));

webpackConfig.plugins = [
    new WebpackOnBuildPlugin(function() {
        mkdirp.sync('_screenshots');
        createComponentTreeJSON()
            .then(grabScreenshots)
            .then(processScreenshots(app))
            .then(() => process.exit())
            .catch(error => {
                console.log(error);
                process.exit(1);
            });
    }),
];

const compiler = webpack(webpackConfig);
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
