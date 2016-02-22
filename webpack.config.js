/* eslint-env node */
const path = require('path');

module.exports = {
    entry: {
        playground: [ path.resolve(__dirname, './playground') ],
        diff: [ path.resolve(__dirname, './diffApp') ],
    },
    output: {
        path: __dirname,
        filename: 'bundle-[name].js',
    },
    resolve: {
        alias: {
            COSMOS_COMPONENTS: path.resolve(__dirname, './example/components'),
            COSMOS_FIXTURES: path.resolve(__dirname, './example/fixtures'),
            GET_FIXTURE_TREE: path.resolve(__dirname, './example/get-component-fixture-tree'),
        },
    },
    module: {
        noParse: /ui-components-bottom/,
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                },
                exclude: /(node_modules|vendors)/,
                include: __dirname,
            },
        ],
    },
};
