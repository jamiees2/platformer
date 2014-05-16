var gulp = require('gulp')
  , gutil = require('gulp-util')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifycss = require('gulp-minify-css')
  , minifyhtml = require('gulp-minify-html')
  , processhtml = require('gulp-processhtml')
  , jshint = require('gulp-jshint')
  , uglify = require('gulp-uglify')
  , connect = require('gulp-connect')
  , coffee = require('gulp-coffee')
  , rmdir = require('rimraf')
  , order = require('gulp-order')
  , paths;

paths = {
  assets: 'src/assets/**/*',
  css:    __dirname + '/src/css/*.css', 
  js:     [__dirname + '/src/js/**/*.js', "!" + __dirname + '/src/js/lib/*.js'],
  lib: __dirname + '/src/lib/**/*.js',
  coffee: __dirname + '/src/coffee/**/*.coffee',
  dist:   './dist/'
};

gulp.task('copy', function () {
  gulp.src(paths.assets).pipe(gulp.dest(paths.dist + 'assets'));
});

gulp.task('lib', function(){
	gulp.src(paths.lib)
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest(paths.dist));
});
gulp.task('uglify', function () {
  gulp.src([__dirname + "/src/js/**/!(game)*.js",
	    __dirname + "/src/js/game.js"])
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.dist))
    // .pipe(uglify({outSourceMaps: false}))
    // .pipe(gulp.dest(paths.dist));
});

gulp.task('minifycss', function () {
 gulp.src(paths.css)
    .pipe(minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('processhtml', function() {
  gulp.src('src/index.html')
    .pipe(processhtml('index.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifyhtml', function() {
  gulp.src('dist/index.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('jshint', function() {
  gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('coffee', function() {
  gulp.src(paths.coffee)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(__dirname + '/src/js'));
});

gulp.task('html', function(){
  gulp.src(__dirname + '/src/*.html')
    .pipe(connect.reload());
});

gulp.task('connect', function(){
	connect.server({
	  root: [__dirname + '/src'],
	  port: 9000,
	  livereload: true
	});
});

gulp.task('watch', function () {
  gulp.watch(paths.coffee, ['coffee']);
  // gulp.watch(paths.js, ['jshint']);
  gulp.watch(['./src/index.html', paths.css, paths.js], ['html']);
});

gulp.task('clean',function(){
  rmdir('dist', function(){});
});

gulp.task('default', ['coffee', 'connect', 'watch']);
gulp.task('build', ['clean', 'copy','lib', 'uglify', 'minifycss', 'processhtml', 'minifyhtml']);

