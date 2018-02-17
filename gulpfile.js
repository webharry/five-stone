var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var jsmin = require('gulp-jsmin');
var browserSync = require('browser-sync');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
// var px2rem = require('gulp-px-to-rem');
const zip = require('gulp-zip');


gulp.task('default',['server']);

gulp.task('server',['htmlmin','cssmin','jsmin','img'],function(){
    browserSync.init({
        server: 'app'
    });

    gulp.watch("src/**/*.less", ['cssmin']);
    gulp.watch("src/*.html", ['htmlmin']);
    gulp.watch('src/**/*.js', ['jsmin']);
    gulp.watch("src/img/*",['img']);
    gulp.watch("app/**/*").on('change', browserSync.reload);
});

gulp.task('htmlmin',function(){
    gulp.src('src/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('app'));
});

gulp.task('jsmin',function(){
    gulp.src('src/**/*.js')
        // .pipe(jsmin())
        .pipe(gulp.dest('app'));
});

gulp.task('cssmin',function(){
    var css = ['src/**/*.less','src/**/*.css'];
    gulp.src(css)
        // .pipe(px2rem({accuracy:2}))
        .pipe(less())
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(cssmin())
        .pipe(gulp.dest('app'));
});

gulp.task('img',function(){
    gulp.src('src/images/*')
        .pipe(gulp.dest('app/images'));
});

gulp.task('zip',() => {
    return gulp.src('app/**/*')
        .pipe(zip('app.zip'))
        .pipe(gulp.dest('./'))
});