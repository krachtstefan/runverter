/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = EmberApp.env();
var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;
var stripDebug = require('broccoli-strip-debug');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: 'http://runverter.s3-website-eu-west-1.amazonaws.com/'
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild,
    },
    minifyCSS: { enabled: isProductionLikeBuild },
    minifyJS: { enabled: isProductionLikeBuild },

    tests: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
    hinting: process.env.EMBER_CLI_TEST_COMMAND || !isProductionLikeBuild,
  });

  app.import("bower_components/ember-localstorage-adapter/localstorage_adapter.js");
  app.import('bower_components/uikit/css/uikit.min.css');
  app.import('bower_components/uikit/js/uikit.min.js');
  app.import('bower_components/SelectOrDie/_src/selectordie.min.js');
  app.import('bower_components/bignumber.js/bignumber.min.js');

  return isProductionLikeBuild ? stripDebug(app.toTree()) : app.toTree();
};
