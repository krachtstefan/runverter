import Ember from 'ember';
import { computed } from '@ember/object';
export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  queryParams: {
    'i18n.locale' : 'l',                                        // selected locale
    'selectedToolKey' : 't',                                    // selected tool
    'paceCalcLengthMetricsQuery' : 'lm',                        // selected length metric for pace calculator
    'paceCalcTempoMetricsQuery' : 's',                          // selected tempo metric for pace calculator
    'racePredictorAchievedRunLengthMetricsQuery' : 'lm-p-a',    // selected length metric for pace calculator
    'racePredictorPredictedRunLengthMetricsQuery' : 'lm-rp-p',  // selected length metric for pace calculator
    'splitsCalcLengthMetricsQuery' : 'lm-sc',                   // selected length metric for splits calculator
    'splitsCalcDistanceQuery' : 'sd',                           // selected split distance for splits calculator
    'splitsCalcMetricsQuery' : 'sm',                            // selected split metric for splits calculator
    'splitsCalcStrategyQuery' : 'ss',                           // selected split strategy for splits calculator
    'splitsCalcSlopeQuery' : 'es',                              // selected even slope option for splits calculator
    'splitsCalcTempoMetricsSelected' : 's-sc',                  // selected tempo metric for splits calculator
    'expertMode' : 'nerd',                                      // selected display mode
    'imprintVisible' : 'info',                                  // selected display mode
    'index_key' : "index_key"                                   // keep the index_key param provided by ember-cli-deploy
  },

  // will be used to overwrite the default of the component
  selectedToolKey : "pca",
  paceCalcLengthMetricsQuery : "km",
  paceCalcTempoMetricsQuery : "minkm",
  racePredictorAchievedRunLengthMetricsQuery : "km",
  racePredictorPredictedRunLengthMetricsQuery : "km",
  splitsCalcLengthMetricsQuery : "km",
  splitsCalcDistanceQuery: 1,
  splitsCalcMetricsQuery: "km",
  splitsCalcStrategyQuery: 0,
  splitsCalcSlopeQuery : false,
  splitsCalcTempoMetricsSelected: "minkm",

  toolsAvailable : [
    "pca", "pc", "lc", "rp", "sc"
  ],

  didInitAttrs() {
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  expertMode : false,
  imprintVisible : false,

  tools : computed("toolsAvailablem", "i18n.locale", function(){
    var selectItems = [];
    var self = this;
    this.get("toolsAvailable").forEach(function(item){
      selectItems.push({
        "key" : item,
        "name" : self.get('i18n').t("tools."+item+".name"),
        "label" : self.get('i18n').t("tools."+item+".label"),
        "description" : self.get('i18n').t("tools."+item+".description"),
      });
    });
    return selectItems;
  }),

  openDonationMessage : function(){
    var donationMessage = this.get("notifications.content").filterBy('message.string', this.get('i18n').t("flashMessages.donationMessage").string);
    if(donationMessage.length == 0){
      this.get('notifications').success("<span>"+this.get('i18n').t("flashMessages.donationMessage")+"</span>",{htmlContent: true});
    }
  },

  selectedTool : computed("selectedToolKey", "i18n.locale", function(){
    return Ember.A(this.get('tools')).findBy("key", this.get("selectedToolKey"));
  }),

  selectedToolClass : computed("selectedTool", function(){
    return "container-"+this.get("selectedTool.key");
  }),

  expertModeClass : computed("expertMode", function(){
    return this.get("expertMode") === true ? "expertModeOn" : "expertModeOff";
  }),

  selectedToolPca: computed("selectedToolKey", function () {
    return this.get("selectedToolKey") === "pca" ? true : false;
  }),

  selectedToolPc: computed("selectedToolKey", function () {
    return this.get("selectedToolKey") === "pc" ? true : false;
  }),

  selectedToolLc: computed("selectedToolKey", function () {
    return this.get("selectedToolKey") === "lc" ? true : false;
  }),

  selectedToolRp: computed("selectedToolKey", function () {
    return this.get("selectedToolKey") === "rp" ? true : false;
  }),

  selectedToolSc: computed("selectedToolKey", function () {
    return this.get("selectedToolKey") === "sc" ? true : false;
  }),

  handleRunPersistence: Ember.observer("model.run.timeSec", "model.run.lengthM", function () {
    this.get("model.run").save();
  }),

  handleAchievedRunPersistence: Ember.observer("model.prediction.achievedRun.lengthM", "model.prediction.achievedRun.timeSec", function () {
    // only save the user generated achieved runs with the dedicated id, otherwise the default value of achievedRun would be saved too
    if(this.get("model.prediction.achievedRun.id") === "achievedRun"){
      this.get("model.prediction.achievedRun.content").save();
    }
  }),

  handleSplitPersistence: Ember.observer("model.run.splits.content", function () {
    if(this.get("model.run.splits.content")){
      this.get("model.run.splits.content").save();
    }
  }),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection);
    },
    showDonationMessage: function() {
      this.openDonationMessage();
    }
  }
});
