import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('tools', { path: '/' }, function(){
    this.route('locale', { path: '/:locale' });
  });
});

export default Router;
