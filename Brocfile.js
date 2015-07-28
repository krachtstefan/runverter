/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import("bower_components/ember-localstorage-adapter/localstorage_adapter.js");
app.import('bower_components/uikit/css/uikit.min.css');
app.import('bower_components/uikit/js/uikit.min.js');
app.import('bower_components/SelectOrDie/_src/selectordie.min.js');
app.import('bower_components/SelectOrDie/_src/selectordie.css');
module.exports = app.toTree();