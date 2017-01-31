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
    return this.store.findRecord('run', "runverter").then(function(run) {
      var achievedRun = self.store.createRecord('run', {
        id : "achievedRun",
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      });

      run.set("updatedAt", new Date());
      return RSVP.hash({
        run: run,
        prediction: self.store.createRecord('prediction', {
          achievedRunRaw: achievedRun,
          predictedRunRaw: run,
        })
      });
    }, function() {
      var run = self.store.createRecord('run', {
        id : "runverter",
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      });
      return RSVP.hash({
        run : run,
        prediction: self.store.createRecord('prediction', {
          predictedRunRaw: run
        })
      });
    });
  },

  recognizeUrlChange : Ember.observer("router.url", function() {
    this.set('headData.url', window.location.href);
  }),
});
