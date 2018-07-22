const path = require('path');
const gulp = require('gulp');
const gutil = require("gulp-util");
const del = require('del');
const webpack = require('webpack');

function webpackConfig(mode) {
    return {
        mode: mode,
        entry: {
            "mider": path.resolve(__dirname, './src/index.js'),
        },
        output: {
            filename: mode === 'production' ? "[name].min.js" : "[name].js",
            library: "$wd",
            libraryTarget: "umd"
        },
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
            ]
        },
    };
}

function webpackLog(err, stats) {
    // running error
    if (err) {
        throw new gutil.PluginError("webpack", err);
    }
    // compilation error
    const info = stats.toJson();
    if (stats.hasErrors()) {
        throw new gutil.PluginError("webpack", info.errors.join("\r\n"));
    }
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');
}

gulp.task('clean', function () {
    return del(['dist/*']);
});

gulp.task('build', ['build-min'], function (callback) {
    webpack(webpackConfig('none'), function (err, stats) {
        webpackLog(err, stats);
        callback();
    });
});

gulp.task('build-min', ['clean'], function (callback) {
    webpack(webpackConfig('production'), function (err, stats) {
        webpackLog(err, stats);
        callback();
    });
});
