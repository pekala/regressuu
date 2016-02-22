const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const requireFromString = require('require-from-string');
const webpackConfigTree = require('./webpack.config.tree');

module.exports = function() {
    const memfs = new MemoryFS();
    const compiler = webpack(webpackConfigTree);
    compiler.outputFileSystem = memfs;
    return new Promise(resolve => {
        compiler.run(function () {
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
