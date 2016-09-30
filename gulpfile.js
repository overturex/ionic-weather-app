var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var minify = require('gulp-minify');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: [
      './www/lib/angular-local-storage/dist/angular-local-storage.js',
      './www/js/**/*.js'
  ],
  jsSrc:['./www/src/js/**/*.js'],
  jsMinified:''
};

gulp.task('default', ['sass', 'js', 'compress']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./www/src/js/'));
});

gulp.task('compress', function() {
    gulp.src(paths.jsSrc)
        .pipe(minify({
            ext:{
                //src:'-debug.js',
                min:'.js'
            },
            //exclude: ['tasks'],
            //ignoreFiles: ['-min.js'],
            noSource:true
        }))
        .pipe(gulp.dest('./www/build/assets/js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.jsSrc, ['compress'])
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
