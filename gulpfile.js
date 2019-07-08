const gulp = require('gulp');
const sass = require('gulp-sass');
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');


// Set the banner content
const banner = ['/*!\n',
		' * Legacy Electric - legacyelectricaustin.com\n',
		' * Copyright 2017-' + (new Date()).getFullYear(), ' Sarah Schieffer Riehl with source theme by Black Rock Digital\n',
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
gulp.task('sass', () => {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(header(banner))
		.pipe(gulp.dest('public/css'))
});

// Minify compiled CSS
gulp.task('minify-css', gulp.series('sass', () => {
	return gulp.src('public/css/styles.css')
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/css'))
}));

//concat js
gulp.task('concat-js', () => {
	return gulp.src('./src/js/*.js')
		.pipe(concat('index.js'))
		.pipe(header(banner))
		.pipe(gulp.dest('public/js'))
});

// Minify JS
gulp.task('minify-js', gulp.series('concat-js', () => {
	return gulp.src('public/js/index.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/js'))
}));

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', (done) => {

	return gulp.parallel(
		() => gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map']).pipe(gulp.dest('public/vendor/bootstrap')),
		() => gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js']).pipe(gulp.dest('public/vendor/jquery'))
	)(done);
})

// dev task
gulp.task('build:development', gulp.series(
	(done) => gulp.parallel('copy', 'sass', 'concat-js')(done), 
	() => {
		gulp.watch(['./src/scss/*/*.scss'], gulp.series('sass'));
		gulp.watch(['./src/js/*.js'], gulp.series('concat-js'));
	})
);

//production task
gulp.task('build:production', (done) => gulp.parallel('copy', 'minify-css', 'minify-js')(done));
