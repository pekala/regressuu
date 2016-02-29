/* eslint-env node */
'use strict';

const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const requireFromString = require('require-from-string');
const webpackConfigTree = require('./webpack.config').componentTree;

module.exports = config => () => {
    const memfs = new MemoryFS();
    webpackConfigTree.resolve = {
        alias: {
            COSMOS_COMPONENTS: config.COSMOS_COMPONENTS,
            COSMOS_FIXTURES: config.COSMOS_FIXTURES,
            GET_FIXTURE_TREE: config.GET_FIXTURE_TREE,
        },
    };
    const compiler = webpack(webpackConfigTree);
    compiler.outputFileSystem = memfs;
    return new Promise(resolve => {
        compiler.run(() => {
            const filePath = path.join(webpackConfigTree.output.path, webpackConfigTree.output.filename);
            const fileContent = memfs.readFileSync(filePath).toString();
            const componentTree = requireFromString(fileContent);
            const componentsData = Object.keys(componentTree).map(componentName => {
                const fixtures = componentTree[componentName].fixtures;
                const fixtureData = Object.keys(fixtures).map(fixtureName => ({
                    name: fixtureName,
                    path: fixtures[fixtureName].path,
                }));
                return {
                    name: componentName,
                    fixtures: fixtureData,
                };
            });
            resolve(componentsData);
        });
    });
};
