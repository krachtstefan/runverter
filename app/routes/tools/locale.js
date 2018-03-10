import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  i18n: inject.service(),
  model: function(params) {
    if(params.locale){
      this.set('i18n.locale', params.locale);
    }
  }
});
