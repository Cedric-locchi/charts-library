'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// See also
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// https://github.com/Browsersync/recipes/tree/master/recipes/gulp.browserify

// add custom browserify options here
var customOpts = {
    entries: ['./src/AllCharts.js'],
    debug: true,
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);


b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b
    // Because uglify isn't es6 compliant yet...
    // https://github.com/babel/babelify
    // http://babeljs.io/docs/plugins/preset-es2015/
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        //.on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit("end");
        })
        .pipe(source('all-charts.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(gulp.dest('./dist/js'))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist/js'));

}

module.exports = {
    name: 'js',
    before: ['lint'],
    after: bundle
};