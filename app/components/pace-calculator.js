import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { run } from '@ember/runloop';
export default Component.extend({

  i18n: inject.service(),

  runLengthMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],
  runTempoMetricsSelected : "minkm", // may be overwritten when using this component
  runTempoMetricsAvailable : ["minkm", "minmi", "kmh", "mih"],

  racePickerVisible : false,
  timePickerVisible : false,

  races : inject.service('race'),
  targetTimes : inject.service('target-time'),

  isTouchDevice : computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  targetTimesSuggestions  : computed("run.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("run").isInRange(item.startM, item.endM);
    });
  }),

  runLengthMetrics : computed("runLengthMetricsAvailable", "i18n.locale", "runLengthMetricsSelected", function(){
    var runLengthMetrics = [];
    var self = this;
    this.get("runLengthMetricsAvailable").forEach(function(item){
      runLengthMetrics.push({
        "key" : item,
        "label" : self.get('i18n').t("metrics.distance."+item),
      });
    });

    // sort the array to place the selected option on top to avoid jiggling on init
    runLengthMetrics.sort(function(a) {
      return a.key != self.get("runLengthMetricsSelected");
    });
    return runLengthMetrics;
  }),

  runTempoMetrics : computed("runTempoMetricsAvailable", "i18n.locale", "runTempoMetricsSelected", function(){
    var runTempoMetrics = [];
    var self = this;
    this.get("runTempoMetricsAvailable").forEach(function(item){
      runTempoMetrics.push({
        "key" : item,
        "label" : self.get('i18n').t("metrics.tempo."+item),
      });
    });

    // sort the array to place the selected option on top to avoid jiggling on init
    runTempoMetrics.sort(function(a) {
      return a.key != self.get("runTempoMetricsSelected");
    });
    return runTempoMetrics;
  }),

  didRender: function() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, function() {
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

  tooltipLengthKm : computed("run.lengthKm", "i18n.locale", function(){
    return this.get("run.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipLengthMi : computed("run.lengthMi", "i18n.locale", function(){
    return this.get("run.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  tooltipTimeHr : computed("run.timeHr", "i18n.locale", function(){
    return this.get("run.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipTimeMin : computed("run.timeMin", "i18n.locale", function(){
    return this.get("run.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipTimeSec : computed("run.timeSec", "i18n.locale", function(){
    return this.get("run.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  tooltipPaceMinPerKm : computed("run.paceMinPerKm", "i18n.locale", function(){
    return this.get("run.paceMinPerKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minkm");
  }),

  tooltipPaceMinPerMi : computed("run.paceMinPerMi", "i18n.locale", function(){
    return this.get("run.paceMinPerMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minmi");
  }),

  tooltipSpeedKmHr : computed("run.speedKmHr", "i18n.locale", function(){
    return this.get("run.speedKmHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.kmh");
  }),

  tooltipSpeedMiHr : computed("run.speedMiHr", "i18n.locale", function(){
    return this.get("run.speedMiHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.mih");
  }),

  expertModeClass : computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),

  showRunLengthKm: computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "km" ? true : false;
  }),

  showRunLengthMi: computed('runLengthMetricsSelected', function () {
    return this.get("runLengthMetricsSelected") === "mi" ? true : false;
  }),

  showRunTempoMinKm: computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "minkm" ? true : false;
  }),

  showRunTempoMinMi: computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "minmi" ? true : false;
  }),

  showRunTempoKmH: computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "kmh" ? true : false;
  }),

  showRunTempoMiH: computed('runTempoMetricsSelected', function () {
    return this.get("runTempoMetricsSelected") === "mih" ? true : false;
  }),

  racePickerVisibleClass: computed('racePickerVisible', 'isTouchDevice', function () {
    return this.get("racePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  timePickerVisibleClass: computed('timePickerVisible', 'isTouchDevice',  function () {
    return this.get("timePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
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
