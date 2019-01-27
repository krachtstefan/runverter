import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  didTransition: function() {
    this._super(...arguments);
    return ga('send', 'pageview', {
      page: this.get('url'),
      title: this.get('currentPath')
    });
  }
});

Router.map(function() {
  this.route('tools', { path: '/' }, function() {
    this.route('locale', { path: '/:locale' });
  });
});

export default Router;
