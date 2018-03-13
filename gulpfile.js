var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    browser      = require('browser-sync'),
    sourcemaps   = require('gulp-sourcemaps'),
    imagemin     = require('gulp-imagemin'),
    iconfont     = require('gulp-iconfont'),
    consolidate  = require('gulp-consolidate');

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          includePaths: [
            'node_modules/foundation-sites/scss',
            'node_modules/bootstrap/scss'
          ]
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/assets/css'))
        .pipe(browser.stream({match: '**/*.css'}));
});

gulp.task("build:icons", function() {
    return gulp.src(["./assets/icons/*.svg"])//path to svg icons
      .pipe(iconfont({
        fontName: "myicons",
        formats: ["ttf", "eot", "woff", "woff2", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        fontHeight: 10000,
        normalize: true
      }))
      .on('glyphs', function (glyphs) {

        gulp.src("./assets/icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myicons",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("./sass/icons/"));//generated scss files with classes
      })
      .pipe(gulp.dest("build/assets/fonts/"));//icon font destination
});


gulp.task('image-min', function() {
      gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/assets/images'))
  }
);

// Builds the documentation and framework files
//gulp.task('build', ['clean', 'sass', 'javascript']);

// Starts a BrowerSync instance
gulp.task('serve', ['sass'], function(){
  browser.init({
	  	server: {
            baseDir: "./"
        }
  	});
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['serve'], function() {    
  gulp.watch(['sass/**/*.scss'], ['sass']);  
  gulp.watch('./**/*.html').on('change', browser.reload);
});