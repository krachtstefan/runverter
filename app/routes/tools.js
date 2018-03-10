import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Route.extend({

  i18n: service(),
  headData: service(),

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
        timeSec : new BigNumber(13499),
        lengthM : new BigNumber(42195)
      });
    }).then(function(run){
      self.store.findRecord('run', "achievedRun").then(function(achievedRun){
        prediction.set('achievedRun', achievedRun);
      }, function() {
        var achievedRun = self.store.createRecord('run', {
          id : "achievedRun",
          timeSec : new BigNumber(2700),
          lengthM : new BigNumber(10000)
        });
        prediction.set('achievedRun', achievedRun);
      });
      return run;
    }).then(function(run){
      self.store.findRecord('splits', "splits").then(function(splits){
        run.set('splits', splits);
      }, function() {
        var splits = self.store.createRecord('splits', {
          id : "splits",
        });
        run.set('splits', splits);
      });
      return run;
    });

    var settings = this.store.findRecord('settings', "settings").then(function(settings){
      return settings;
    }, function() {
      return self.store.createRecord('settings', {
        id : "settings"
      });
    });

    return RSVP.hash({
      run: run,
      prediction: prediction,
      settings: settings,
    });
  },

  recognizeUrlChange : observer("router.url", function() {
    this.set('headData.url', window.location.href);
  }),
});
