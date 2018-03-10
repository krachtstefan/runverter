import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  i18n:  service(),
  model: function(params) {
    if(params.locale){
      this.set('i18n.locale', params.locale);
    }
  }
});
