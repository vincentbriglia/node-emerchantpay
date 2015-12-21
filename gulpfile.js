'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    istanbul = require('gulp-istanbul'),
    codacy = require('gulp-codacy'),
    debug = require('gulp-debug'),
    coveralls = require('gulp-coveralls');

gulp.task('test', ['eslint'], function () {
    return gulp.src('./test/**/*.js', {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('coverage', ['eslint'], function (done) {
    // no return, don't return the stream when callbacking
    gulp.src('./lib/**/*.js')
        .pipe(istanbul()) // covering files
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src('./test/**/*.js')
                .pipe(mocha({
                    reporter: 'spec'
                }))
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', done);
        });
});

gulp.task('report-coverage', function () {
    return gulp.src('./coverage/**/lcov.info')
            .pipe(debug())
            .pipe(coveralls());
});

gulp.task('report-codacy', function () {
    return gulp.src('./coverage/**/lcov.info')
            .pipe(debug())
            .pipe(codacy());
});

gulp.task('eslint', function () {
    return gulp.src([
            './lib/**/*.js',
            './test/**/*.js',
            './gulpfile.js'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('default', ['test']);
