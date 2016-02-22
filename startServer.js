/* eslint-env node */
'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const webpackDevMiddlewareFactory = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config').main;
const config = require('./config');

module.exports = app => () => new Promise((resolve, reject) => {
    webpackConfig.plugins = [
        new WebpackOnBuildPlugin(() => resolve()),
    ];
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = webpackDevMiddlewareFactory(compiler, {
        noInfo: true,
    });
    app.use(webpackDevMiddleware);
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'componentsApp/index.html'));
    });
    app.listen(config.SERVER_PORT, 'localhost', function(error) {
        if (error) {
            reject(error);
            return;
        }
        resolve();
    });
});
