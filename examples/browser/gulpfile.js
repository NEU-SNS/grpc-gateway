var gulp = require('gulp');

var path = require('path');

var bower = require('gulp-bower');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gprocess = require('gulp-process');
var serve = require('gulp-serve');
var shell = require('gulp-shell');
var wait = require('gulp-wait');

gulp.task('bower', function(){
  return bower();
});

gulp.task('server', shell.task([
  'go build -o bin/example-server github.com/gengo/grpc-gateway/examples/server',
]));

gulp.task('gateway', shell.task([
  'go build -o bin/example-gw github.com/gengo/grpc-gateway/examples',
]));

gulp.task('serve-server', ['server'], function(){
  gprocess.start('server-server', 'bin/example-server', [
      '--logtostderr',
  ]);
  gulp.watch('bin/example-server', ['server']);
});

gulp.task('serve-gateway', ['gateway', 'serve-server'], function(){
  gprocess.start('gateway-server', 'bin/example-gw', [
      '--logtostderr', '--swagger_dir', path.resolve("../examplepb"),
  ]);
  gulp.watch('bin/example-gateway', ['gateway']);
});

gulp.task('serve', serve('.'));

gulp.task('mocha', ['bower', 'serve', 'serve-gateway', 'serve-server'], function(done) {
  var l = gulp.src(['echo_service.test.js'], {read: false})
    .pipe(wait(1500))
    .pipe(mocha())
    .on('error', function(err) { done(err); process.exit(1); })
    .pipe(exit());
});

gulp.task('default', ['mocha']);
