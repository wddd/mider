// test express server
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.text()); // for parsing text/plain
app.use(router);
app.listen(15678);

// karma.conf.js
module.exports = (config) => {
    config.set({
        frameworks: ['jasmine'],
        // ... normal karma configuration
        files: [
            // all files ending in "_test"
            {pattern: '**/*_test.js', watched: false}
        ],
        reporters: ['progress', 'coverage-istanbul'],
        preprocessors: {
            // add webpack as preprocessor
            '**/*_test.js': ['webpack', 'sourcemap'],
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [{
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: "es2015"
                            }
                        }]
                    },
                    // test coverage loader
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'istanbul-instrumenter-loader',
                            options: {esModules: true}
                        },
                        enforce: 'post',
                        exclude: /node_modules|vendor|utils|\.spec\.js$/,
                    }
                ],
            }
        },
        coverageIstanbulReporter: {
            reports: ['html', 'text-summary'],
            fixWebpackSourcePaths: true,
            dir: 'coverage',
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        browsers: ['Chrome'],
        plugins: [
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage-istanbul-reporter',
            'karma-chrome-launcher',
            'karma-ie-launcher',
        ],
        proxies: {
            '/api': 'http://localhost:15678/api',
        },
    })
};