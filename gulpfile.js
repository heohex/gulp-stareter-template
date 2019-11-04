'use strict';

var gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();

gulp.task('serve', function() {
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  });
});

gulp.task('pug',function(){
  return gulp.src('src/pug/pages/*.pug')
    .pipe(gp.pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
    .on('end', browserSync.reload);
});

gulp.task('stylus',function(){
  return gulp.src('src/static/stylus/main.styl')
    .pipe(gp.sourcemaps.init())
    .pipe(gp.stylus({
      'include css': true
    }))
    .pipe(gp.autoprefixer({
      browsers: ['last 10 versions']
    }))
    .on("error", gp.notify.onError({
      title: "Style error"
    }))
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('build/static/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function(){
  gulp.watch('src/pug/**/*.pug',gulp.series('pug'));
  gulp.watch('src/static/stylus/**/*.styl',gulp.series('stylus'));
  gulp.watch('src/static/js/main.js',gulp.series('scripts'));
  gulp.watch('src/static/img/*',gulp.series('img:dev'));
});

gulp.task('scripts:lib',function(){
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/slick-carousel/slick/slick.min.js'
  ])
    .pipe(gp.concat('libs.min.js'))
    .pipe(gulp.dest('build/static/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts',function(){
  return gulp.src('src/static/js/main.js')
    .pipe(gulp.dest('build/static/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('img:dev', function () {
  return gulp.src('src/static/img/*')
    .pipe(gulp.dest('build/static/img/'));
});

gulp.task('img:build', function () {
  return gulp.src('src/static/img/*.{png,jpg,gif}')
    .pipe(gp.tinypng('YOUR_CODE'))
    .pipe(gulp.dest('build/static/img/'));
});

gulp.task('default', gulp.series(
  gulp.parallel('pug','stylus', 'scripts', 'scripts:lib', 'scripts', 'img:dev'),
  gulp.parallel('watch','serve')
));

gulp.task('build', gulp.series(
  gulp.parallel('pug','stylus', 'scripts', 'scripts:lib', 'scripts', 'img:build'),
  gulp.parallel('watch','serve')
));
