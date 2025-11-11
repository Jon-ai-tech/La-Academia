const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const imagemin = null; // Skip imagemin for now
const { deleteAsync } = require('del');

// Source and destination paths
const paths = {
  src: {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    html: '*.html',
    images: 'images/**/*',
    fonts: 'fonts/**/*'
  },
  dest: {
    root: 'public', // <--- NUEVO: Define la carpeta de salida principal
    css: 'public/css', // <--- Las rutas usan 'public'
    js: 'public/js', // <--- Las rutas usan 'public'
    images: 'public/images', // <--- Las rutas usan 'public'
    fonts: 'public/fonts' // <--- Las rutas usan 'public'
  }
};

// Clean dist folder
function clean() {
  return deleteAsync(['dist']);
}

// Compile SCSS
function styles() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(rename('locomotive-styles.css'))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSync.stream());
}

// Process JavaScript (since we can't use ES modules with this setup, create a simple bundle)
function scripts() {
  // For now, just copy the individual files - we'll handle modules differently
  return gulp.src('src/js/main.js')
    .pipe(rename('locomotive-app.js'))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSync.stream());
}

// Optimize images
function images() {
  return gulp.src(paths.src.images)
    .pipe(gulp.dest(paths.dest.images));
}

// Copy fonts
function fonts() {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dest.fonts));
}

// Start BrowserSync server
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000,
    open: true,
    notify: false
  });

  gulp.watch(paths.src.scss, styles);
  gulp.watch(paths.src.js, scripts);
  gulp.watch(paths.src.html).on('change', browserSync.reload);
}

// Watch files for changes
function watch() {
  gulp.watch(paths.src.scss, styles);
  gulp.watch(paths.src.js, scripts);
  gulp.watch(paths.src.images, images);
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, fonts));
const dev = gulp.series(build, gulp.parallel(watch, serve));

// Export tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.watch = watch;
exports.serve = serve;
exports.build = build;
exports.dev = dev;
exports.default = dev;
