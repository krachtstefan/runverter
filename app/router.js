import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
   didTransition: function() {
    this._super(...arguments);
    return ga('send', 'pageview', {
      'page': this.get('url'),
      'title': this.get("currentPath")
    });
  }
});

Router.map(function() {
  this.route('tools', { path: '/' }, function(){
    this.route('locale', { path: '/:locale' });
  });
});

export default Router;
