/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import('bower_components/ember-i18n/lib/i18n.js');

module.exports = app.toTree();