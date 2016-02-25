import Ember from 'ember';
export default Ember.Component.extend({
  queryParams: ['runLengthMetricsSelected', 'runTempoMetricsSelected'],
  runLengthMetricsSelected : "km",
  runLengthMetrics : [
    {
      id : "km",
      label : "km"
    },
    {
      id : "mi",
      label : "mi"
    }
  ],

  runTempoMetricsSelected : "minkm",

  runTempoMetrics : [
    {
      id : "minkm",
      label : "min/km"
    },
    {
      id : "minmi",
      label : "min/mi"
    },
    {
      id : "kmh",
      label : "km/h"
    },
    {
      id : "mih",
      label : "mi/h"
    }
  ],

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.runLength").selectOrDie({customID:"runLength"});
      $("select.runTempo").selectOrDie({customID:"runTempo"});
    });
  },

  visible: function () {
    return this.get("selectedMenuItem.key") === "paceCalculator" ? true : false;
  }.property('selectedMenuItem'),

  showRunLengthKm: function () {
    return this.get("runLengthMetricsSelected") === "km" ? true : false;
  }.property('runLengthMetricsSelected'),

  showRunLengthMi: function () {
    return this.get("runLengthMetricsSelected") === "mi" ? true : false;
  }.property('runLengthMetricsSelected'),

  showRunTempoMinKm: function () {
    return this.get("runTempoMetricsSelected") === "minkm" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoMinMi: function () {
    return this.get("runTempoMetricsSelected") === "minmi" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoKmH: function () {
    return this.get("runTempoMetricsSelected") === "kmh" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoMiH: function () {
    return this.get("runTempoMetricsSelected") === "mih" ? true : false;
  }.property('runTempoMetricsSelected'),
});
