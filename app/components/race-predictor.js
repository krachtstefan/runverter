import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  achievedRunMetricsSelected : "km",  // may be overwritten when using this component
  predictedRunMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],

  achievedRacePickerVisible: false,
  achievedTimePickerVisible: false,
  predictedRacePickerVisible: false,
  predictedTimePickerVisible: false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  isTouchDevice : Ember.computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  achievedTimesSuggestions  : Ember.computed("prediction.achievedRun.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("prediction.achievedRun").isInRange(item.startM, item.endM);
    });
  }),

  predictedTimesSuggestions  : Ember.computed("prediction.predictedRun.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("prediction.predictedRun").isInRange(item.startM, item.endM);
    });
  }),

  predictedRunLengthMetrics : Ember.computed("runLengthMetricsAvailable", "i18n.locale", function(){
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
      $("select.predictedRunLength").selectOrDie({customID:"predictedRunLength"}).ready(function() {
        $("select.predictedRunLength").selectOrDie("update"); // need to trigger update to select the correct initial value
        $("#predictedRunLength").focusin(function() {
          self.set("predictedRacePickerVisible", true);
        });
        $("#predictedRunLength").focusout(function() {
          self.set("predictedRacePickerVisible", false);
        });
      });
      $("select.achievedRunLength").selectOrDie({customID:"achievedRunLength"}).ready(function() {
        $("select.achievedRunLength").selectOrDie("update"); // need to trigger update to select the correct initial value
        $("#achievedRunLength").focusin(function() {
          self.set("achievedRacePickerVisible", true);
        });
        $("#achievedRunLength").focusout(function() {
          self.set("achievedRacePickerVisible", false);
        });
      });
    });
  },

  tooltipAchievedLengthKm : Ember.computed("prediction.achievedRun.lengthKm", "i18n.locale", function(){
    return this.get("prediction.achievedRun.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipAchievedLengthMi : Ember.computed("prediction.achievedRun.lengthMi", "i18n.locale", function(){
    return this.get("prediction.achievedRun.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipAchievedTimeHr : Ember.computed("prediction.achievedRun.timeHr", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipAchievedTimeMin : Ember.computed("prediction.achievedRun.timeMin", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipAchievedTimeSec : Ember.computed("prediction.achievedRun.timeSec", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  tooltipPredictedLengthKm : Ember.computed("prediction.predictedRun.lengthKm", "i18n.locale", function(){
    return this.get("prediction.predictedRun.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipPredictedLengthMi : Ember.computed("prediction.predictedRun.lengthMi", "i18n.locale", function(){
    return this.get("prediction.predictedRun.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  tooltipPredictedTimeHr : Ember.computed("prediction.predictedRun.timeHr", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipPredictedTimeMin : Ember.computed("prediction.predictedRun.timeMin", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipPredictedTimeSec : Ember.computed("prediction.predictedRun.timeSec", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "rp" ? true : false;
  }),

  showAchievedRunLengthKm: Ember.computed('achievedRunMetricsSelected', function () {
    return this.get("achievedRunMetricsSelected") === "km" ? true : false;
  }),

  showAchievedRunLengthMi: Ember.computed('achievedRunMetricsSelected', function () {
    return this.get("achievedRunMetricsSelected") === "mi" ? true : false;
  }),

  showPredictedRunLengthKm: Ember.computed('predictedRunMetricsSelected', function () {
    return this.get("predictedRunMetricsSelected") === "km" ? true : false;
  }),

  showPredictedRunLengthMi: Ember.computed('predictedRunMetricsSelected', function () {
    return this.get("predictedRunMetricsSelected") === "mi" ? true : false;
  }),

  achievedRacePickerVisibleClass: Ember.computed('achievedRacePickerVisible', 'isTouchDevice', function () {
    return this.get("achievedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  achievedTimePickerVisibleClass: Ember.computed('achievedTimePickerVisible', 'isTouchDevice', function () {
    return this.get("achievedTimePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  predictedRacePickerVisibleClass: Ember.computed('predictedRacePickerVisible', 'isTouchDevice', function () {
    return this.get("predictedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  predictedTimePickerVisibleClass: Ember.computed('predictedTimePickerVisible', 'isTouchDevice', function () {
    return this.get("predictedTimePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  actions: {
    setAchievedRace: function(race) {
      if(race !== null){
        this.get("prediction.achievedRun").set("lengthM",race.lengthM);
      }
    },
    setAchievedTime: function(targetTime) {
      if(targetTime !== null){
        this.get("prediction.achievedRun").set("timeSec",targetTime.timeSec);
      }
    },
    setPredictedRace: function(race) {
      if(race !== null){
        this.get("prediction.predictedRun").set("lengthM",race.lengthM);
      }
    },
    setPredictedTime: function(targetTime) {
      if(targetTime !== null){
        this.get("prediction.predictedRun").set("timeSec",targetTime.timeSec);
      }
    }
  }
});
