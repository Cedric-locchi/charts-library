var gulp = require('gulp');

module.exports = {
    name: 'default', // TODO change with file name ?
    before: ['build'],
    after: function() {
        // gulp.watch('./src/js/**/*', ['js']);
    }
};