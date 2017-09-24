var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


// Set the banner content
var banner = ['/*!\n',
		' * Legacy Electric - legacyelectricaustin.com\n',
		' * Copyright 2013-' + (new Date()).getFullYear(), ' Sarah Schieffer Riehl with source theme by Black Rock Digital\n',
		' * Licensed under MIT\n',
		' * Permission is hereby granted, free of charge, to any person obtaining a copy\n',
		' * of this software and associated documentation files (the "Software"), to deal\n',
		' * in the Software without restriction, including without limitation the rights\n',
		' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n',
		' * copies of the Software, and to permit persons to whom the Software is\n',
		' * furnished to do so, subject to the following conditions:\n\n',
		' * The above copyright notice and this permission notice shall be included in all\n',
		' * copies or substantial portions of the Software.\n\n',
		' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n',
		' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n',
		' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n',
		' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n',
		' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n',
		' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n',
		' * SOFTWARE.\n',
		' */\n',
		''
].join('');

// Compile LESS files from /less into /css
gulp.task('sass', function() {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(header(banner))
		.pipe(gulp.dest('public/css'))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
	return gulp.src('public/css/*.css')
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/css'))
});

//concat js
gulp.task('concat-js', function() {
	return gulp.src('./src/js/*.js')
		.pipe(concat('index.js'))
		.pipe(header(banner))
		.pipe(gulp.dest('public/js'))
});

// Minify JS
gulp.task('minify-js', function() {
	return gulp.src('public/js/agency.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/js'))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
	gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
		.pipe(gulp.dest('public/vendor/bootstrap'))

	gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('public/vendor/jquery'))
})

// dev task
gulp.task('dev', ['sass', 'concat-js'], function() {
	gulp.watch('./src/scss/*/*.scss', ['sass']);
	gulp.watch('./src/js/*.js', ['concat-js'])

});

//production task
gulp.task('prod', ['sass', 'concat-js', 'minify-css', 'minify-js'], function() {
	gulp.watch('./src/scss/*/*.scss', ['sass', 'minify-css']);
	gulp.watch('./src/js/*.js', ['concat-js', 'minify-js'])
});
