import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	this.resource('paceCalculator', { path: '/' }, function(){});
  this.resource('paceConverter', { path: '/pace' }, function(){});
  this.resource('lengthConverter', { path: '/length' }, function(){});
});


export default Router;
