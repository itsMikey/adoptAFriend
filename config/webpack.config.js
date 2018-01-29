const path = require('path');
const fs = require('fs');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
// const merge = require('webpack-merge');
const yaml = require('js-yaml');

const commonConfig = {
    plugins: [
        new LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules
            options: {
                APP_CONFIG: yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './env.yml')), 'utf-8')
            }
        })
    ]
};

const APP_CONFIG = commonConfig.plugins[0].options.options.APP_CONFIG;

const slsConfig = {
    context: path.resolve(__dirname, '../src'),
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: [
                    "**/*.spec.ts",
                    "node_modules"
                ],
            }
        ]
    },
    entry: {
        'intent-handler': './sls/skill/AdoptFriendIntentHandler'
    },
    output: {
        path: path.resolve(__dirname, '../adopt-friend-skill/dist/'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.node']
    },
    target: 'node',
    plugins: [
        new DefinePlugin({
            'process.env.APP_CONFIG': JSON.stringify(APP_CONFIG)
        })
    ],
};


module.exports = slsConfig