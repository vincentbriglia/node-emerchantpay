'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    coverage = require('gulp-coverage'),
    complexity = require('gulp-complexity');

gulp.task('test', ['eslint'], function () {
    return gulp.src('./test/**/*.js', {
            read: false
        })
        .pipe(complexity())
        .pipe(coverage.instrument({
            pattern: [
                './lib/**/*.js'
            ],
            debugDirectory: 'debug'
        }))
        .pipe(mocha({
            reporter: 'spec'
        }))
        .pipe(coverage.report({
            outFile: 'coverage.html'
        }))
        .pipe(coverage.enforce());
});

gulp.task('complexity', function () {
    return gulp.src([
            './lib/**/*.js',
            './test/**/*.js'
        ])
        .pipe(complexity());
});

gulp.task('eslint', function () {
    return gulp.src([
            './lib/**/*.js',
            './test/**/*.js'
        ])
        .pipe(eslint());
});

gulp.task('default', ['test', 'complexity']);
