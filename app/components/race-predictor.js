import Ember from 'ember';
import $ from 'jquery';
import { computed } from '@ember/object';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  achievedRunMetricsSelected : "km",  // may be overwritten when using this component
  predictedRunMetricsSelected : "km", // may be overwritten when using this component
  runLengthMetricsAvailable : ["km", "mi"],

  achievedRacePickerVisible: false,
  achievedTimePickerVisible: false,
  predictedRacePickerVisible: false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  isTouchDevice : computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  achievedTimesSuggestions : computed("prediction.achievedRun.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("prediction.achievedRun.content").isInRange(item.startM, item.endM);
    });
  }),

  predictedTimesSuggestions  : computed("prediction.predictedRun.lengthM", "i18n.locale", function(){
    var self = this;
    return this.get("targetTimes.templates").filter(function(item) {
      return self.get("prediction.predictedRun.content").isInRange(item.startM, item.endM);
    });
  }),

  achievedRunLengthMetrics : computed("runLengthMetricsAvailable", "i18n.locale", "achievedRunMetricsSelected", function(){
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
      return a.key != self.get("achievedRunMetricsSelected");
    });
    return runLengthMetrics;
  }),

  predictedRunLengthMetrics : computed("runLengthMetricsAvailable", "i18n.locale", "predictedRunMetricsSelected", function(){
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
      return a.key != self.get("predictedRunMetricsSelected");
    });
    return runLengthMetrics;
  }),

  /**
   * import the predicted run when initializing this component
   */
  importPredictedRun : Ember.on("init", function(){
    this.get("prediction.predictedRun").setProperties({ lengthM : this.get("run.lengthM"), timeSec : this.get("run.timeSec")});
    this.get("prediction").updateAchievedRunSec();
  }),

  /**
   * export the predicted run everytime it changes,
   * data need to be consistent as soon as possible since the user can leave or reload the page any time
   */
  exportPredictedRun : Ember.observer('prediction.predictedRun.lengthM', 'prediction.predictedRun.timeSec', function(){
    this.set("run.lengthM", this.get("prediction.predictedRun.lengthM"));
    this.set("run.timeSec", this.get("prediction.predictedRun.timeSec"));
  }),

  displayPeterRiegelExlanation : Ember.on('init', Ember.observer('prediction.peterRiegelMethodSuitable', function(){
    var self = this;
    if(this.get("prediction.peterRiegelMethodSuitable")===false && this.get("settings.displayPeterRiegelExlanation")===true){
      this.set("settings.displayPeterRiegelExlanation", false);

      this.get('notifications').info(this.get('i18n').t("flashMessages.peterRiegelExlanation"), {
        onClick() {
          self.get("settings").save();
        }
      });
    }
  })),

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

  tooltipAchievedLengthKm : computed("prediction.achievedRun.lengthKm", "i18n.locale", function(){
    return this.get("prediction.achievedRun.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipAchievedLengthMi : computed("prediction.achievedRun.lengthMi", "i18n.locale", function(){
    return this.get("prediction.achievedRun.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipAchievedTimeHr : computed("prediction.achievedRun.timeHr", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipAchievedTimeMin : computed("prediction.achievedRun.timeMin", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipAchievedTimeSec : computed("prediction.achievedRun.timeSec", "i18n.locale", function(){
    return this.get("prediction.achievedRun.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  tooltipPredictedLengthKm : computed("prediction.predictedRun.lengthKm", "i18n.locale", function(){
    return this.get("prediction.predictedRun.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipPredictedLengthMi : computed("prediction.predictedRun.lengthMi", "i18n.locale", function(){
    return this.get("prediction.predictedRun.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  tooltipPredictedTimeHr : computed("prediction.predictedRun.timeHr", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.hr");
  }),

  tooltipPredictedTimeMin : computed("prediction.predictedRun.timeMin", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeMin").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.min");
  }),

  tooltipPredictedTimeSec : computed("prediction.predictedRun.timeSec", "i18n.locale", function(){
    return this.get("prediction.predictedRun.timeSec").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.time.sec");
  }),

  expertModeClass : computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),

  showAchievedRunLengthKm: computed('achievedRunMetricsSelected', function () {
    return this.get("achievedRunMetricsSelected") === "km" ? true : false;
  }),

  showAchievedRunLengthMi: computed('achievedRunMetricsSelected', function () {
    return this.get("achievedRunMetricsSelected") === "mi" ? true : false;
  }),

  showPredictedRunLengthKm: computed('predictedRunMetricsSelected', function () {
    return this.get("predictedRunMetricsSelected") === "km" ? true : false;
  }),

  showPredictedRunLengthMi: computed('predictedRunMetricsSelected', function () {
    return this.get("predictedRunMetricsSelected") === "mi" ? true : false;
  }),

  achievedRacePickerVisibleClass: computed('achievedRacePickerVisible', 'isTouchDevice', function () {
    return this.get("achievedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  achievedTimePickerVisibleClass: computed('achievedTimePickerVisible', 'isTouchDevice', function () {
    return this.get("achievedTimePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  predictedRacePickerVisibleClass: computed('predictedRacePickerVisible', 'isTouchDevice', function () {
    return this.get("predictedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
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
    }
  }
});
