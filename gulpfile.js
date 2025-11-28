const { src, dest, watch, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const autoprefixerModule = require('gulp-autoprefixer');
const autoprefixer = autoprefixerModule.default || autoprefixerModule;
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const gulpIf = require('gulp-if');
const inject = require('gulp-inject');

const isProd = process.env.NODE_ENV === 'production';

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    entry: 'src/scss/main.scss',
    watch: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png,svg,gif,webp}',
    dest: 'dist/images/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
//   fonts: {
//     src: 'src/fonts/**/*.{woff,woff2,ttf,otf,eot}',
//     dest: 'dist/fonts/'
//   }
};

function clean() {
  return del(['dist']);
}

function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.entry)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(
      gulpSass({
        outputStyle: 'expanded'
      }).on('error', gulpSass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: [
          'last 3 versions',
          '> 1%',
          'ios >= 12',
          'android >= 7'
        ]
      })
    )
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(dest(paths.scripts.dest));
}

function fonts() {
  return src(paths.fonts.src)
    .pipe(dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

function injectAssets() {
    const sources = src([
        'dist/css/**/*.css',
        'dist/js/**/*.js',
    ], { read: false });

    return src('dist/*.html')
        .pipe(inject(sources, {
            relative: true
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream()) 
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    open: false
  });

  watch(paths.html.src, series(html, injectAssets));
  watch(paths.styles.watch, series(styles, injectAssets));
  watch(paths.scripts.src, scripts, injectAssets);
  watch(paths.images.src, images);
//   watch(paths.fonts.src, fonts);
}

const build = series(
  clean,
  parallel(html, styles, images, scripts),
  injectAssets
);

const dev = series(build, serve);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
// exports.fonts = fonts;
exports.build = build;
exports.dev = dev;
exports.default = dev;
