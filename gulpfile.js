'use strict';

const gulp = require('gulp');
const prepros = require('gulp-preprocess');
const newer = require('gulp-newer')
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const del = require('del');
const uglify = require('gulp-uglify');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const htmlhint = require("gulp-htmlhint");
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const cssbeautify = require('gulp-cssbeautify');
const csscomb = require('gulp-csscomb');


//const concat = require('gulp-concat');


//****** Gulp del, cleaning public folder ******
gulp.task('clean', function () {
	del('public/*');
});


// Compiling HTML
gulp.task('html', function () {
	gulp.src('frontend/html/*.html')
		.pipe(newer('public/**/*.html'))
		.pipe(prepros())
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
		//.pipe(htmlhint.failReporter())
		//.pipe(htmlclean())
		.pipe(gulp.dest('public'))
		.pipe(browsersync.reload({ stream: true }));
});


//****** SASS compiling ******
gulp.task('sass', function () {
	return gulp.src('frontend/sass/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 2 versions'))
		.pipe(csscomb())
		.pipe(cssbeautify())
		//.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('public/css'))
		.pipe(browsersync.reload({ stream: true }));
});

gulp.task('CSS_minCSS', function () {
	return gulp.src(['frontend/sass/**/*.css', 'frontend/sass/**/*.min.css'])
		.pipe(newer('public/css'))
		.pipe(gulp.dest('public/css'));
});


//****** Image minification ******
gulp.task('imagemin', function () {
	gulp.src('frontend/img/**/*')
		.pipe(newer('public/img/'))
		.pipe(imagemin())
		.pipe(gulp.dest('public/img/'));
});


//****** JavaScript compiling ******
gulp.task('js', function () {
	return gulp.src(['frontend/js/**/*', '!frontend/js/**/*.min.js'])
		.pipe(newer('public/js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', function (err) {
			const message = err.message || '';
			const errName = err.name || '';
			const codeFrame = err.codeFrame || '';
			gutil.log(gutil.colors.red.bold('[JS babel error]') + ' ' + gutil.colors.bgRed(errName));
			gutil.log(gutil.colors.bold('message:') + ' ' + message);
			gutil.log(gutil.colors.bold('codeframe:') + '\n' + codeFrame);
			this.emit('end');
		})
		//.pipe(uglify())
		.pipe(gulp.dest('public/js'))
		.pipe(browsersync.reload({ stream: true }));
});

gulp.task('minJS', function () {
	return gulp.src('frontend/js/**/*.min.js')
		.pipe(newer('public/js'))
		.pipe(gulp.dest('public/js'));
});


//****** Copy Fonts ******
gulp.task('fonts', function () {
	gulp.src('frontend/fonts/**/*')
		.pipe(newer('public/fonts'))
		.pipe(gulp.dest('public/fonts'));
});


//****** Browsersync ******
gulp.task('browsersync', function () {
	browsersync.init({
		server: 'public'
	});
	browsersync.watch('public/**/*.*').on('change', browsersync.reload);
});


//****** Default task ******
gulp.task('default', ['html', 'sass', 'CSS_minCSS', 'imagemin', 'fonts', 'js', 'minJS', 'browsersync'], function () {

	gulp.watch('frontend/html/**/*', ['html']);

	gulp.watch('frontend/sass/**/*', ['sass']);

	gulp.watch('frontend/sass/**/*', ['CSS_minCSS']);

	gulp.watch('frontend/img/**/*', ['imagemin']);

	gulp.watch('frontend/fonts/**/*', ['fonts']);

	gulp.watch('frontend/js/**/*', ['js']);

	gulp.watch('frontend/js/**/*.min.js', ['minJS']);

});