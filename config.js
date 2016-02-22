/* eslint-env node */
'use strict';
const path = require('path');

const DEFAULT_CONFIG = {
    COSMOS_COMPONENTS: path.resolve(__dirname, './example/components'),
    COSMOS_FIXTURES: path.resolve(__dirname, './example/fixtures'),
    GET_FIXTURE_TREE: path.resolve(__dirname, './example/get-component-fixture-tree'),
    SERVER_PORT: 1358,
};

module.exports = DEFAULT_CONFIG;
