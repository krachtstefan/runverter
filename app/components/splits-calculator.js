import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  runLengthMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],
  runTempoMetricsSelected : "minkm", // may be overwritten when using this component
  runTempoMetricsAvailable : ["minkm", "minmi", "kmh", "mih"],

  splitDistancesSelected : 1, // may be overwritten when using this component
  splitDistancesAvailable : [1, 5, 10],
  splitMetricsSelected : "km", // may be overwritten when using this component
  splitMetricsAvailable : ["km", "mi"],

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
    });
  },

  calculateSplits : Ember.on("init", Ember.observer("run.lengthM", "run.timeSec" ,function(){
    this.get("run").calculateSplits();
  })),

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
