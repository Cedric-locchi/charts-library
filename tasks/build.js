var gulp = require('gulp');
var gutil = require('gulp-util');

module.exports = {
    name: 'build',
    before: ['js'],
    after: function (cb) {

        gutil.log('build done');
        cb();
    }
};