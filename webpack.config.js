/* eslint-env node */
'use strict';

const path = require('path');
const config = require('./config');

const aliases = {
    COSMOS_COMPONENTS: config.COSMOS_COMPONENTS,
    COSMOS_FIXTURES: config.COSMOS_FIXTURES,
    GET_FIXTURE_TREE: config.GET_FIXTURE_TREE,
};

module.exports.main = {
    entry: {
        playground: [ path.resolve(__dirname, './componentsApp/index') ],
        diff: [ path.resolve(__dirname, './diffApp/app') ],
    },
    output: {
        path: __dirname,
        filename: 'bundle-[name].js',
    },
    resolve: {
        alias: aliases,
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                },
                exclude: /(node_modules)/,
                include: __dirname,
            },
        ],
    },
};

module.exports.componentTree = {
    entry: [
        path.resolve(__dirname, './componentsApp/componentFixtureTree'),
    ],
    output: {
        path: __dirname,
        filename: 'component.tree.bundled.js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        alias: aliases,
    },
};

