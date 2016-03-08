import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  runLengthMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],
  runTempoMetricsSelected : "minkm", // may be overwritten when using this component
  runTempoMetricsAvailable : ["minkm", "minmi", "kmh", "mih"],

  runLengthMetrics : Ember.computed("runLengthMetricsAvailable", function(){
    var runLengthMetrics = [];
    var self = this;
    this.get("runLengthMetricsAvailable").forEach(function(item){
      runLengthMetrics.push({
        "key" : item,
        "label" : self.get('i18n').t("metrics.distance."+item),
      });
    });
    return runLengthMetrics;
  }),

  runTempoMetrics : Ember.computed("runTempoMetricsAvailable", function(){
    var runTempoMetrics = [];
    var self = this;
    this.get("runTempoMetricsAvailable").forEach(function(item){
      runTempoMetrics.push({
        "key" : item,
        "label" : self.get('i18n').t("metrics.tempo."+item),
      });
    });
    return runTempoMetrics;
  }),

  didRender: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.runLength").selectOrDie({customID:"runLength"}).ready(function() {
        $("select.runLength").selectOrDie("update"); // need to trigger update to select the correct initial value
      });

      $("select.runTempo").selectOrDie({customID:"runTempo"}).ready(function() {
        $("select.runTempo").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  visible: function () {
    return this.get("selectedMenuItem.key") === "pca" ? true : false;
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
