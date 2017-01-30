/* Gulp Plugins
======================================== */

var fs          = require('fs'),
    gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    // gulp-*, gulp.*で始まる名前のものを一括で読込
    $           = require('gulp-load-plugins')();

/* Setting
======================================== */

//開発環境パス
var src = {
  'base' : './dev/',
  'scss' : ['./dev/src/**/*.scss'],
  'js'   : ['./dev/src/**/*.js'],
  'img'  : ['./dev/src/**/*.{png,jpg,gif,svg,ico}']
};

//出力環境パス
var dest = {
  'base' : './htdocs/',
  'css'  : './htdocs/assets/css/',
  'js'   : './htdocs/assets/js/',
  'img'  : './htdocs/assets/img/'
};

//対象ブラウザ
var AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'iOS >= 9',
  'Android >= 4.4'
];

/* Tasks
======================================== */

/**
 * ejsのコンパイル
 */
gulp.task('ejs', function() {
  gulp.src([ src.base + '**/*.ejs', '!' + src.base + '**/_*.ejs' ])
  .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
  .pipe($.ejs({
      site  : JSON.parse(fs.readFileSync(src.data + 'config.json'))
    },
    {
      ext: '.html'
    }
  ))
  .pipe(gulp.dest(dest.base));
});

/**
 * Sassのコンパイル・圧縮
 */
gulp.task('sass' , function(){
  return gulp.src(src.scss)
  .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
  .pipe($.sourcemaps.init())
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe($.csscomb())
  .pipe($.combineMediaQueries())
  .pipe($.sourcemaps.write('maps', {
    includeContent: false,
    sourceRoot: dest.css + 'maps'
  }))
  .pipe(gulp.dest(dest.css))
  .pipe($.cleanCss())
  .pipe($.rename({ extname : '.min.css' }))
  .pipe(gulp.dest(dest.css));
});

/**
 * JSの結合
 */
gulp.task('webpack', function() {
  var webpackConfig = require('./webpack.config.js');

  return gulp.src(src.js)
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest(dest.js));
});

/**
 * 画像の圧縮
 */
gulp.task('image', function() {
  return gulp.src(src.img)
  .pipe($.changed(dest.img))
  .pipe($.imagemin({
    progressive: true,
    interlaced: true,
    optimizationLevel: 7
  }))
  .pipe(gulp.dest(dest.img));
});


/**
 * hologram
 */
 gulp.task('hologram', function(){
  var configGlob = './hologram_config.yml';
  gulp.src( configGlob )
    .pipe($.hologram());
 });

 /*========================================*/
/* Server / Watch
/*========================================*/

/**
 * ローカルサーバーの起動
 */
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: dest.base
    }
  });
});


/**
 * ファイル監視
 */
gulp.task('watch', function() {
  // 出力領域が更新されたらオートリロード
  $.watch([
      dest.base + '**/*.html',
      dest.base + '**/*.css',
      dest.base + '**/*.js',
      dest.base + '**/*.jpg',
      dest.base + '**/*.png',
      dest.base + '**/*.svg',
  ], function (){
      browserSync.reload();
      // browserSync.reload({stream: true});
  });


  // 開発環境のファイルを監視
  $.watch( src.base + '**/*.ejs' , function () {
    gulp.start( 'ejs' );
  });
  $.watch( src.scss , function () {
    gulp.start( 'sass' );
  });
  $.watch( src.js , function () {
    gulp.start( 'webpack' );
  });
  $.watch( src.img , function () {
    gulp.start( 'imagemin' );
  });
  $.watch( [ './hologram/**/*' ] , function () {
    gulp.start( 'hologram' );
  });
});

/**
 * デフォルトタスク
 */
gulp.task('default', ['server', 'watch'] );
