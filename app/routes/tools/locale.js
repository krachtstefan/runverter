import Ember from 'ember';
export default Ember.Route.extend({

  i18n: Ember.inject.service(),


  model: function(params) {
    if(params.locale){
      this.set('i18n.locale', params.locale);
    }
  }
});
