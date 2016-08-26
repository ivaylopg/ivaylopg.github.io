var gulp = require('gulp')
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('customJS', function() {
  return gulp.src(['_js/nodeField.js','./_js/main.js'])
    .pipe(concat('ivaylogetov.min.js'))
    .pipe(uglify({
      mangle: true,
      preserveComments: 'license'
    }))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('concatjs', function() {
  return gulp.src(['./_js/*.js'])
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('watch', function() {
    gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
