var gulp = require('gulp');
var eslint = require('gulp-eslint'); // https://github.com/adametry/gulp-eslint

module.exports = {
    name: 'lint',  // TODO change with file name ?
    before: [],
    after: function () {
        return gulp
            .src(['./src/js/**/*.js','./src/js-charts/**/*.js', '!node_modules/**'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    }
};