/* eslint-env node */
const path = require('path');

module.exports = {
    entry: [
        path.resolve(__dirname, './playground'),
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            COSMOS_COMPONENTS: path.resolve(__dirname, './example/components'),
            COSMOS_FIXTURES: path.resolve(__dirname, './example/fixtures'),
            GET_FIXTURE_TREE: path.resolve(__dirname, './example/get-component-fixture-tree'),
        },
    },
};
