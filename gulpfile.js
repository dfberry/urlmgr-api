const gulp = require('gulp');

const mocha = require('gulp-mocha');

let testdirs = [
    './dist/libs/*.spec.js',
    './dist/routes/*.spec.js',
    './dist/routes/v1/*.spec.js',
    './dist/utilties/*.spec.js'
];

gulp.task('runtests', () =>

	gulp.src(testdirs, {timeout:20000})
		// `gulp-mocha` needs filepaths so you can't have any plugins before it
		.pipe(mocha({reporter: 'nyan'}))
);
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

gulp.task('assets-test', function () {
    
            return gulp.src([
                'src/**/*',
                './package.json',
                './yarn.lock'
              ])
              .pipe(gulp.dest('dist'));
    });

gulp.task("build", ["assets"], function () {
    // This will only run if the lint task is successful...
    console.log("build is done");
});

gulp.task("build-test", ["assets-test"], function () {
    // This will only run if the lint task is successful...
    console.log("build is done");
});
