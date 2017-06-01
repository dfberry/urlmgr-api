const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");

const MAIN_ENTRY = './src/index.js';
const SRC_CODE = './src/**/*.js';
const SRC_TEST = './src/**/*.spec.js';
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
gulp.task('copyAssets', ["copyConfig", "copyFavIcon"], function () {
    // This will only run if the lint task is successful...
    console.log("copy assets done");
});
gulp.task('copyConfig', function () {
    gulp.src('./src/config/config.json')
        .pipe(gulp.dest('./dist/config'));
});
gulp.task('copyFavIcon', function () {
    gulp.src('./src/public/*.*')
        .pipe(gulp.dest('./dist/public/'));
});

gulp.task("transpile", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("build", ["copyAssets", "transpile"], function () {
    // This will only run if the lint task is successful...
    console.log("build is done");
});

//gulp.task('default', ['lint','test'], function () {
gulp.task('default', ['copy', 'transpile'], function () {
    // This will only run if the lint task is successful...
    console.log("copy is done");
});