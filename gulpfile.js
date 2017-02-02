const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

const MAIN_ENTRY = './src-non-sails/index.js';
const SRC_CODE = './src-non-sails/**/*.js';
const SRC_TEST = './src-non-sails/**/*.spec.js';
const IGNORE_CHANGES_ARRAY = [];

const LINT_OPTIONS = {};

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src([SRC_CODE])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('develop', function () {
  var stream = nodemon({ script: MAIN_ENTRY
          , ext: 'html js'
          , ignore: IGNORE_CHANGES_ARRAY
          , tasks: ['lint'] 
          , nodeArgs: ['--debug=5858']
        })
 
  stream
      .on('restart', function () {
        console.log('restarted!')
      })
      .on('crash', function() {
        console.error('Application has crashed!\n')
         stream.emit('restart', 10)  // restart the server in 10 seconds 
      })
})

gulp.task('test', () => 
    gulp.src(SRC_TEST, {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({reporter: 'nyan'}))
);

gulp.task('default', ['develop'], function () {
    // This will only run if the lint task is successful...
});