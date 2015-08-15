var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('./sass/*.scss')
        .pipe(sass({
            'outputStyle' : 'expanded'
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function() {
    gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);