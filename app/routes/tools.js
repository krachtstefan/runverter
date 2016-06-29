import Ember from 'ember';
export default Ember.Route.extend({

  i18n: Ember.inject.service(),


  model: function(params) {
    if(params.locale){
      this.set('i18n.locale', params.locale);
    }
    var self = this;
    return this.store.findRecord('run', "runverter").then(function(run) {
      return run;
    }, function() {
      return self.store.createRecord('run', {
        id : "runverter",
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      });
    });
  }
});