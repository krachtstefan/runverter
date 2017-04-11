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

  splitStrategiesSelected : 0, // may be overwritten when using this component
  splitStrategiesAvailable : [3, 2, 1, 0, -1, -2, -3],

  evenSlopeSelected : false, // may be overwritten when using this component
  evenSlopeAvailable : [true, false],

  racePickerVisible : false,
  timePickerVisible : false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  isTouchDevice : Ember.computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  chartOption : {
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    },
    tooltips: {
      enabled : false
    }
  },

  chartData : Ember.computed("run.lengthM", "run.timeSec", "splitDistancesSelectedMeters", "splitStrategiesSelected", "evenSlopeSelected" , function(){
    var data = {
      labels: this.get("run.splits.splits").map(function(data) { return data.get("run.lengthKm").round(2).toNumber(); }),
      datasets: [
        {
          label: "",
          backgroundColor: "rgba(0,136,204,0.4)",
          borderColor: "rgba(0,136,204,1)",
          data : this.get("run.splits.splits").map(function(data) { return data.get("split.speedKmHr").toNumber(); }),
          spanGaps: false,
        }
      ]
    };
    return data;
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

  splitStrategies : Ember.computed("splitStrategiesAvailable", "i18n.locale", function(){
    var splitStrategies = [];
    var self = this;
    this.get("splitStrategiesAvailable").forEach(function(item){
      splitStrategies.push({
        "key" : item,
        "label" : self.get('i18n').t("tools.sc.splitStrategies."+item),
      });
    });
    return splitStrategies;
  }),

  evenSlope : Ember.computed("evenSlopeAvailable", "i18n.locale", function(){
    var evenSlope = [];
    var self = this;
    this.get("evenSlopeAvailable").forEach(function(item){
      evenSlope.push({
        "key" : item,
        "label" : self.get('i18n').t("tools.sc.evenSlope."+item),
      });
    });
    return evenSlope;
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
      $("select.splitStrategies").selectOrDie({customID:"splitStrategies"}).ready(function() {
        $("select.splitStrategies").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
      $("select.evenSlope").selectOrDie({customID:"evenSlope"}).ready(function() {
        $("select.evenSlope").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
      $("select.splitTempo").selectOrDie({customID:"splitTempo"}).ready(function() {
        $("select.splitTempo").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  calculateSplits : Ember.on("init", Ember.observer("run.lengthM", "run.timeSec", "splitDistancesSelectedMeters", "splitStrategiesSelected", "evenSlopeSelected" ,function(){
    this.set("run.splits.splitDistance", this.get("splitDistancesSelectedMeters"));
    this.set("run.splits.splittingStrategy", new BigNumber(this.get("splitStrategiesSelected")));
    this.set("run.splits.evenSlope", this.get("evenSlopeSelected"));
    this.get("run.splits.content").calculateSplits();
  })),

  splitDistancesPossible : Ember.computed("run.lengthM", "splitMetricsSelected", function(){
    var self = this;
    var splitDistancesPossible = [];
    var splitDistanceM;
    var numberOfPossibleSplits;
    this.get("splitDistancesAvailable").forEach(function(item, index){
      if(self.get("splitMetricsSelected") === "mi"){
        splitDistanceM = new BigNumber(item).times(self.get("run.miToM"));
      }else{
        splitDistanceM = new BigNumber(item).times(1000);
      }
      numberOfPossibleSplits = self.get("run.lengthM").dividedBy(splitDistanceM).ceil().toString();
      // add all items that make more than one split
      // and always add first item to ensure the array is never empty
      if (numberOfPossibleSplits > 1 || index === 0){
        splitDistancesPossible.push(item);
      }
    });
    return splitDistancesPossible;
  }),

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

  evenSlopeVisible: Ember.computed('splitStrategiesSelected', function () {
    return this.get("splitStrategiesSelected") === 0 ? false : true;
  }),

  splitsVisible: Ember.computed('run.lengthM', 'splitDistancesSelectedMeters', function () {
    return this.get("run.splits.splits.length") === 0 ? false : true;
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
    return this.get("timePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  evenSlopeVisibleClass: Ember.computed('evenSlopeVisible', function () {
    return this.get("evenSlopeVisible") === true ? "evenSlopeVisible" : "evenSlopeInvisible";
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
