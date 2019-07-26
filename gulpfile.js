var gulp = require('gulp'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require("gulp-notify");

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

////////////////////
// Error Handlers

function onError(error) {
  // Adapted from: https://github.com/mikaelbr/gulp-notify/issues/81

  var lineNumber = (error.lineNumber||error.line) ? 'line ' + (error.lineNumber||error.line) : '';
  var fileName = (error.fileName||error.file) ? (error.fileName||error.file.split('/').pop()) : '';

  notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: ((fileName !== '') ? fileName + ': ' : '') + ((lineNumber !== '') ? lineNumber + ' -- ' : '') + 'See console.',
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  // Alt sounds:
  // 'Bottle', 'Basso'

  // Inspect the error object
  //console.log(error);

  // Easy error reporting
  //console.log(error.toString());

  // Pretty error reporting
  var report = '';
  var chalk = gutil.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  if (lineNumber !== '') { report += chalk('LINE:') + ' ' + lineNumber.split(' ').pop() + '\n'; }
  if (fileName !== '')   { report += chalk('FILE:') + ' ' + fileName + '\n'; }
  report += chalk('PROB:') + ' ' + (error.formatted||error.messageOriginal||error.message||error.messageFormatted) + '\n';

  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
}


////////////////////
// Shortcuts

// gulp.task('js', ['compileCustom','compileTools','minifyCube']);


gulp.task('watchjs', function() {
  gulp.watch(['./_js/custom/nodeField.js','./_js/custom/main.js'], ['compileCustom']);
});

// gulp.task('watch', ['watchjs']);
