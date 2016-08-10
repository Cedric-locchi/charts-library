'use strict';

//<BOOTSTRAP tasks>

var fs = require('fs');
var path = 'tasks';
var tasks_files = fs.readdirSync(path);
var gulp = require('gulp');

tasks_files.forEach(function (file) {
    let task = require('./' + path + '/' + file);
    gulp.task(task.name, task.before, task.after);
});

//</BOOTSTRAP tasks>