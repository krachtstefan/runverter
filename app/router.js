import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('paceCalculator', { path: '/' }, function(){});
  this.resource('paceConverter', { path: '/pace' }, function(){});
  this.resource('lengthConverter', { path: '/length' }, function(){});
  this.resource('racePredictor', { path: '/race' }, function(){});
  this.resource('splitsCalculator', { path: '/splits' }, function(){});
});


export default Router;
