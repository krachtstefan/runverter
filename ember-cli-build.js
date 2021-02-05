'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = EmberApp.env();
var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
var stripDebug = require('broccoli-strip-debug');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: 'https://s.runverter.io/',
      extensions: [
        'js',
        'css',
        'png',
        'jpg',
        'gif',
        'map',
        'json',
        'svg',
        'ico',
      ],
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild,
    },
    minifyCSS: { enabled: isProductionLikeBuild },
    minifyJS: { enabled: isProductionLikeBuild },

    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,

    compassOptions: { imagesDir: 'public/images' },

    emberCliConcat: {
      js: {
        concat: isProductionLikeBuild,
      },
      css: {
        concat: isProductionLikeBuild,
      },
    },
  });

  app.import('bower_components/SelectOrDie/_src/selectordie.min.js');
  app.import('bower_components/bignumber.js/bignumber.js');
  app.import('bower_components/decimal.js/decimal.min.js');

  return isProductionLikeBuild ? stripDebug(app.toTree()) : app.toTree();
};
