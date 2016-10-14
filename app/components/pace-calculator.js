import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  runLengthMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],
  runTempoMetricsSelected : "minkm", // may be overwritten when using this component
  runTempoMetricsAvailable : ["minkm", "minmi", "kmh", "mih"],

  racePickerVisible : false,
  timePickerVisible : false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  targetTimesSuggestions  : Ember.computed("run.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("run").isInRange(item.startM, item.endM);
    });
  }),

  runLengthMetrics : Ember.computed("runLengthMetricsAvailable", "i18n.locale", function(){
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

  runTempoMetrics : Ember.computed("runTempoMetricsAvailable", "i18n.locale", function(){
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
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      var self = this;
      $("select.runLength").selectOrDie({customID:"runLength"}).ready(function() {
        $("select.runLength").selectOrDie("update"); // need to trigger update to select the correct initial value
        $("#runLength").focusin(function() {
          self.set("racePickerVisible", true);
        });
        $("#runLength").focusout(function() {
          self.set("racePickerVisible", false);
        });
      });

      $("select.runTempo").selectOrDie({customID:"runTempo"}).ready(function() {
        $("select.runTempo").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "pca" ? true : false;
  }),

  showRunLengthKm: Ember.computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "km" ? true : false;
  }),

  showRunLengthMi: Ember.computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "mi" ? true : false;
  }),

  showRunTempoMinKm: Ember.computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "minkm" ? true : false;
  }),

  showRunTempoMinMi: Ember.computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "minmi" ? true : false;
  }),

  showRunTempoKmH: Ember.computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "kmh" ? true : false;
  }),

  showRunTempoMiH: Ember.computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "mih" ? true : false;
  }),

  racePickerVisibleClass: Ember.computed('racePickerVisible', function () {
    return this.get("racePickerVisible") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  timePickerVisibleClass: Ember.computed('timePickerVisible', function () {
    return this.get("timePickerVisible") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  actions: {
    setRace: function(race) {
      if(race !== null){
        this.get("run").set("lengthM",race.lengthM);
      }
    },
    setTargetTime: function(targetTime) {
      if(targetTime !== null){
        this.get("run").set("timeSec",targetTime.timeSec);
      }
    }
  }
});
