/**
 * パッケージ読込
 */
var gulp        = require('gulp'),
    styleguide  = require('sc5-styleguide')
    browserSync = require('browser-sync'),
    sequence    = require('run-sequence'),
    grapher     = require('sass-graph'),
    buffer      = require('vinyl-buffer'),
    merge       = require('merge-stream'),
    rimraf      = require('rimraf'),
    fs          = require('fs');

// gulp-*, gulp.*で始まる名前のものを一括で読込
var $ = require('gulp-load-plugins')();

/**
 * パス定義・他
 */
var develop = { //開発用パス
    'root' : 'dev/',
    'ejs'  : ['dev/ejs/**/*.ejs', '!dev/ejs/**/_*.ejs'],
    'data' : 'dev/data/',
    'sass' : 'dev/sass/**/*.scss',
    'minifyCss': 'dev/sass/*.scss',
    'js': ['dev/js/**/*.js', '!' + 'dev/js/lib/**/*.js'],
    'libJs': 'dev/js/lib/**/*.js',
    'image': ['dev/img/**/*.{png,jpg,gif,svg,ico}'],
    'sprite': 'dev/sprite/*.png'
  },
  watch = { //監視用パス
    'ejs' : ['dev/ejs/**/*.ejs'],
    'data' : [develop.data + '**/*.json'],
    'hologram': ['dev/hologram/*.scss','dev/hologram/*.md']
  },
  release = { //リリース用パス
    'root' : 'release/',
    'html' : 'release/',
    'sass' : 'release/assets/css/',
    'js'   : 'release/assets/js/',
    'libJs': 'release/assets/js/',
    'image': 'release/assets/img/',
    'minifyCss': 'release/assets/css/'
  },
  AUTOPREFIXER_BROWSERS = [
    // @see https://github.com/ai/browserslist#browsers
    'last 2 versions',
    'ie >= 11',
    'iOS >= 9',
    'Android >= 4.3'
  ];

/**
 * ejsコンパイル
 */
gulp.task('ejs', function() {
  return gulp.src(develop.ejs)
  // .pipe(cached('ejs'))
  .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
  .pipe($.ejs({
      site  : JSON.parse(fs.readFileSync(develop.data + 'site.json')),
      // list: JSON.parse(fs.readFileSync(develop.data + 'list.json'))
    },
    {ext: '.html'}
  ))
  .pipe(gulp.dest(release.html))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * sassコンパイル
 */
gulp.task('sass', ['hologram'] , function(){
  graph = grapher.parseDir('dev/sass/');
  return gulp.src(develop.sass)
  // .pipe(cached('sass'))
  .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
  .pipe($.sourcemaps.init())
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe($.csscomb())
  .pipe($.combineMediaQueries())
  .pipe($.cleanCss())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(release.sass))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * hologram
 */
 gulp.task('hologram', function(){
  var configGlob = './hologram_config.yml';
  gulp.src( configGlob )
    .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
    .pipe($.hologram());
 });

/**
 * デフォルトjsファイルとjQueryをリリースディレクトリに出力します。
 */
gulp.task('webpack', function() {
  return gulp.src(develop.js)
  .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
  .pipe($.webpack(require('./webpack.config.js')))
  .pipe(gulp.dest(release.js))
  .pipe(browserSync.reload({stream: true}));
});


/**
 * デベロップディレクトリの画像を圧縮、
 * 階層構造を維持したまま、リリースディレクトリに出力します。
 */
gulp.task('image', function() {
  return gulp.src(develop.image)
  .pipe($.changed(release.image))
  .pipe($.imagemin({
    // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
    progressive: true,
    // gifをインターレースgifにします。
    interlaced: true,
    // PNGファイルの圧縮率（7が最高）を指定します。
    optimizationLevel: 7
  }))
  .pipe(gulp.dest(release.image))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * スプライト画像を作成
 */
gulp.task('sprite', function(){
  var spriteData = gulp.src(develop.sprite)
    .pipe($.spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../img/sprite.png',
      padding: 15
    }));
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe($.imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest('dev/img/'));
  var cssStream = spriteData.css
    .pipe(gulp.dest('dev/sass/'));
  return merge(imgStream, cssStream);
});

/**
 * リリースディレクトリの削除
 */
gulp.task('clean', function (cb) {
  rimraf(release.root, cb);
});

/**
 * ビルド
 */
gulp.task('build', function(){
  sequence(
    'sprite',
    ['ejs','image','sass','js']
  )
});

/**
 * 監視
 */
gulp.task('watch', ['build'],function() {
  gulp.watch(watch.ejs, ['ejs']);
  gulp.watch(watch.data, ['ejs']);
  gulp.watch(develop.sass, ['sass']);
  gulp.watch(watch.hologram, ['hologram']);
  gulp.watch(develop.js, ['webpack']);
  gulp.watch(develop.image, ['image']);
  gulp.watch(develop.sprite, ['sprite']);
});

/**
 * ローカルサーバーの起動
 */
gulp.task('browser-sync', function() {
  browserSync({
    port: 3000,
    server: {
      baseDir: 'release/',
      // baseDir: release.root,
      index: "index.html"
    }
  });
});


/**
 * 開発用タスク
 */
gulp.task('default', function() {
  sequence(
    'watch',
    'browser-sync'
  )
});

/**
 * リリースに使用するタスクです。
 * リリースディレクトリを最新の状態にしてから、ファイルの圧縮をします。
 */
gulp.task('release', ['clean'], function() {
  sequence(
    'sprite',
    ['ejs','image','sass','js']
  )
});





