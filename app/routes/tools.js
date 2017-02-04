import Ember from 'ember';
import RSVP from 'rsvp';
export default Ember.Route.extend({

  i18n: Ember.inject.service(),
  headData: Ember.inject.service(),

  model: function(params) {
    if(params.locale){
      this.set('i18n.locale', params.locale);
    }
    var self = this;
    var prediction = self.store.createRecord('prediction', {
      id : "prediction"
    });

    var run = this.store.findRecord('run', "runverter").then(function(run){
      return run;
    }, function() {
      return self.store.createRecord('run', {
        id : "runverter",
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      });
    }).then(function(run){
      self.store.findRecord('run', "achievedRun").then(function(achievedRun){
        prediction.set('achievedRunRaw', achievedRun);
      }, function() {
        var achievedRun = self.store.createRecord('run', {
          id : "achievedRun",
          timeSec : new BigNumber(3600*4),
          lengthM : new BigNumber(42195)
        });
        prediction.set('achievedRunRaw', achievedRun);
      });
      return run;
    });

    return RSVP.hash({
      run: run,
      prediction: prediction
    });
  },

  recognizeUrlChange : Ember.observer("router.url", function() {
    this.set('headData.url', window.location.href);
  }),
});
