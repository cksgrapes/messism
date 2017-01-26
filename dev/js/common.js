var $           = require('jquery'),
    Picturefill = require('picturefill'),
    Slick       = require('slick'),
    Pace        = require('pace'),
    Instafeed   = require('instafeed.js'),
    Lazyload    = require('jquery_lazyload');

var MESSISM = MESSISM || {
  d        : document,
  w        : window,
  $window  : $(window),
  $body    : $('body'),
  isMobile : true,
  ua       : {},
  scroll   : 0
};

(function(common){
  'use strict';

  common.init = function() {
    Pace.on('done', function(){
      MESSISM.$body.addClass('complateFontLoad');
    });
    setAnchor();

  };

  common.resize = function() {
    MESSISM.$window.on('load resize', function(){
      setWindowWidth();
      setUA();
      setViewport();
    });
  };

  common.scroll = function() {
    MESSISM.$window.on('scroll', function(){
      MESSISM.scroll = $(this).scrollTop();
      setFixedPagetop();
    });
  };

  var setWindowWidth = function() {
    var width    = MESSISM.w.innerWidth;
    MESSISM.isMobile = (width < 768) ? true : false;
  };

  var setUA = function() {
    MESSISM.ua.name      = MESSISM.w.navigator.userAgent.toLowerCase();
    MESSISM.ua.isIE      = (MESSISM.ua.name.indexOf('msie') >= 0 || MESSISM.ua.name.indexOf('trident') >= 0);
    MESSISM.ua.isiPhone  = MESSISM.ua.name.indexOf('iphone') >= 0;
    MESSISM.ua.isiPod    = MESSISM.ua.name.indexOf('ipod') >= 0;
    MESSISM.ua.isiPad    = MESSISM.ua.name.indexOf('ipad') >= 0;
    MESSISM.ua.isiOS     = (MESSISM.ua.isiPhone || MESSISM.ua.isiPod || MESSISM.ua.isiPad);
    MESSISM.ua.isAndroid = MESSISM.ua.name.indexOf('android') >= 0;
    MESSISM.ua.isTablet  = (MESSISM.ua.isiPad || (MESSISM.ua.isAndroid && MESSISM.ua.name.indexOf('mobile') < 0));
  };

  var setViewport = function() {
    if (MESSISM.ua.isTablet) {
      $('meta[name=viewport]', $('head')).attr('content','width=1200');
    }else{
      $('meta[name=viewport]', $('head')).attr('content','width=device-width, initial-scale=1');
    }
  };

  var setFixedPagetop = function() {
    var $elm = $('.goPagetop');
    if (MESSISM.scroll > 10) {
      $elm.addClass('show');
    } else {
      $elm.removeClass('show');
    }
  };

  var setAnchor = function(offset) {
    var offset = offset || 0;
    var trg,trgpos;
    $('a[href^="#"]').each(function() {
      $(this).on('click',function(e) {
        e.preventDefault();
        trg = $(this).attr('href');
        trgpos = trg != '#pagetop' && $(trg).offset().top;
        if (trg == '#pagetop') { $('html,body').animate({scrollTop: 0}, 500); }
        $('html,body').animate({scrollTop: (trgpos - offset)}, 500);
      });
    });
  };

}(MESSISM.common = MESSISM.common || {}));

MESSISM.common.init();
MESSISM.common.resize();
MESSISM.common.scroll();
