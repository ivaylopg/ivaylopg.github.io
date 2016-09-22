var gulp = require('gulp')
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('compileCustom', function() {
  return gulp.src(['./_js/custom/nodeField.js','./_js/custom/main.js'])
    .pipe(concat('ivaylogetov.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('compileTools', function() {
  return gulp.src(['./_js/tools/*.js'])
    .pipe(concat('tools.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('minifyCube', function() {
  return gulp.src(['./_js/cube.js'])
    .pipe(uglify({mangle: true}))
    .pipe(rename(function (path) {path.extname = ".min.js"}))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('js', ['compileCustom','compileTools','minifyCube']);
