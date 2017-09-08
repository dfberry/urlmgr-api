const gulp = require('gulp');

gulp.task('assets', function () {

        return gulp.src([
            'src/**/*',
            './package.json',
            './yarn.lock',
            '!./src/**/*.spec.*/',
            '!./src/utilities/*.*/',
            '!./src/utilities',
            '!**/createUser.js/'
          ])
          .pipe(gulp.dest('dist'));
});

gulp.task("build", ["assets"], function () {
    // This will only run if the lint task is successful...
    console.log("build is done");
});
