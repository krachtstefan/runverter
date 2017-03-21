import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  runLengthMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],

  splitTempoMetricsSelected : "minkm", // may be overwritten when using this component
  splitTempoMetricsAvailable : ["minkm", "minmi", "kmh", "mih"],

  splitDistancesSelected : 1, // may be overwritten when using this component
  splitDistancesAvailable : [1, 5, 10],
  splitMetricsSelected : "km", // may be overwritten when using this component

  racePickerVisible : false,
  timePickerVisible : false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  isTouchDevice : Ember.computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

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

  splitTempoMetrics : Ember.computed("splitTempoMetricsAvailable", "i18n.locale", function(){
    var splitTempoMetrics = [];
    var self = this;
    this.get("splitTempoMetricsAvailable").forEach(function(item){
      splitTempoMetrics.push({
        "key" : item,
        "label" : self.get('i18n').t("metrics.tempo."+item),
      });
    });
    return splitTempoMetrics;
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
      $("select.splitDistance").selectOrDie({customID:"splitDistance"}).ready(function() {
        $("select.splitDistance").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
      $("select.splitMetric").selectOrDie({customID:"splitMetric"}).ready(function() {
        $("select.splitMetric").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
      $("select.splitTempo").selectOrDie({customID:"splitTempo"}).ready(function() {
        $("select.splitTempo").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  calculateSplits : Ember.on("init", Ember.observer("run.lengthM", "run.timeSec", "splitDistancesSelectedMeters", "splitDistancesSelected", "splitMetricsSelected" ,function(){
    this.get("run").calculateSplits(this.get("splitDistancesSelectedMeters"));
  })),

  splitDistancesSelectedMeters : Ember.computed("splitDistancesSelected", "splitMetricsSelected", function(){
    if(this.get("splitMetricsSelected") === "mi"){
      return new BigNumber(this.get("splitDistancesSelected")).times(this.get("run.miToM"));
    }else{
      return new BigNumber(this.get("splitDistancesSelected")).times(1000);
    }
  }),

  tooltipLengthKm : Ember.computed("run.lengthKm", "i18n.locale", function(){
    return this.get("run.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipLengthMi : Ember.computed("run.lengthMi", "i18n.locale", function(){
    return this.get("run.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),

  showRunLengthKm: Ember.computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "km" ? true : false;
  }),

  showRunLengthMi: Ember.computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "mi" ? true : false;
  }),

  showKmSplits : Ember.computed("splitMetricsSelected", function(){
    return this.get("splitMetricsSelected") === "km" ? true : false;
  }),

  showSplitTempoMinKm: Ember.computed('splitTempoMetricsSelected', function () {
    return this.get("splitTempoMetricsSelected") === "minkm" ? true : false;
  }),

  showSplitTempoMinMi: Ember.computed('splitTempoMetricsSelected', function () {
    return this.get("splitTempoMetricsSelected") === "minmi" ? true : false;
  }),

  showSplitTempoKmH: Ember.computed('splitTempoMetricsSelected', function () {
    return this.get("splitTempoMetricsSelected") === "kmh" ? true : false;
  }),

  showSplitTempoMiH: Ember.computed('splitTempoMetricsSelected', function () {
    return this.get("splitTempoMetricsSelected") === "mih" ? true : false;
  }),

  tooltipTimeHr : Ember.computed("run.timeHr", "i18n.locale", function(){
    return this.get("run.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipTimeMin : Ember.computed("run.timeMin", "i18n.locale", function(){
    return this.get("run.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipTimeSec : Ember.computed("run.timeSec", "i18n.locale", function(){
    return this.get("run.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  racePickerVisibleClass: Ember.computed('racePickerVisible', 'isTouchDevice', function () {
    return this.get("racePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  timePickerVisibleClass: Ember.computed('timePickerVisible', 'isTouchDevice',  function () {
    return this.get("timePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
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
