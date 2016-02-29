/* eslint-env node */
'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const webpackDevMiddlewareFactory = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config').main;

module.exports = (app, config) => () => new Promise((resolve, reject) => {
    webpackConfig.plugins = [
        new WebpackOnBuildPlugin(() => resolve()),
    ];
    webpackConfig.resolve = {
        alias: {
            COSMOS_COMPONENTS: config.COSMOS_COMPONENTS,
            COSMOS_FIXTURES: config.COSMOS_FIXTURES,
            GET_FIXTURE_TREE: config.GET_FIXTURE_TREE,
        },
    };
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
