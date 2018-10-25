import Controller from '@ember/controller';
import $ from 'jquery';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
export default Controller.extend({

  i18n: service(),
  notifications: service('notification-messages'),

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
    'expertMode' : 'nerd',                                      // expert mode selected
    'darkMode' : 'darkmode',                                    // dark mode
    'imprintVisible' : 'info',                                  // imprint visible
    'displayLogo' : 'logo',                                     // display logo?
    'displayToolsMenu' : 'toolselector',                        // display tools menu?
    'isEmbedded' : 'embedded',                                  // is it embedded in an iframe
    'theme' : "theme",                                          // enable theme parameter
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
  theme: null,

  toolsAvailable : [
    "pca", "pc", "lc", "rp", "sc"
  ],

  didInitAttrs() {
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  expertMode : false,
  darkMode : false,
  displayLogo : true,
  displayToolsMenu: true,
  isEmbedded: false,
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
    return A(this.get('tools')).findBy("key", this.get("selectedToolKey"));
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

  handleRunPersistence: observer("model.run.timeSec", "model.run.lengthM", function () {
    this.get("model.run").save();
  }),

  handleDarkModeClass: observer("darkMode", function () {
    if(this.get("darkMode") == true){
      $("#root").addClass("darkmode");
    }else{
      $("#root").removeClass("darkmode");
    }
  }),

  handleThemeClass: observer("theme", function () {
    $("#root").addClass(this.get("theme"));
  }),

  handleAchievedRunPersistence: observer("model.prediction.achievedRun.lengthM", "model.prediction.achievedRun.timeSec", function () {
    // only save the user generated achieved runs with the dedicated id, otherwise the default value of achievedRun would be saved too
    if(this.get("model.prediction.achievedRun.id") === "achievedRun"){
      this.get("model.prediction.achievedRun.content").save();
    }
  }),

  handleSplitPersistence: observer("model.run.splits.content", function () {
    if(this.get("model.run.splits.content")){
      this.get("model.run.splits.content").save();
    }
  }),

  actions: {
    showDonationMessage: function() {
      this.openDonationMessage();
    }
  }
});
