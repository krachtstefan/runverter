import Ember from 'ember';
export default Ember.Controller.extend({

  i18n: Ember.inject.service(),

  queryParams: {
    'i18n.locale' : 'l',                                        // selected locale
    'selectedToolKey' : 't',                                    // selected tool
    'paceCalcLengthMetricsQuery' : 'lm',                        // selected length metric for pace calculator
    'paceCalcTempoMetricsQuery' : 's',                          // selected tempo metric for pace calculator
    'racePredictorAchievedRunLengthMetricsQuery' : 'lm-p-a',    // selected length metric for pace calculator
    'racePredictorPredictedRunLengthMetricsQuery' : 'lm-rp-p',  // selected length metric for pace calculator
    'expertMode' : 'nerd',                                      // selected display mode
    'imprintVisible' : 'info',                                  // selected display mode
    'index_key' : "index_key"                                   // keep the index_key param provided by ember-cli-deploy
  },

  selectedToolKey : "pca",
  paceCalcLengthMetricsQuery : "km",                            // will be used to overwrite the default of the component
  paceCalcTempoMetricsQuery : "minkm",                          // will be used to overwrite the default of the component
  racePredictorAchievedRunLengthMetricsQuery : "km",            // will be used to overwrite the default of the component
  racePredictorPredictedRunLengthMetricsQuery : "km",           // will be used to overwrite the default of the component

  toolsAvailable : [
    "pca", "pc", "lc", "rp", "sc"
  ],

  didInitAttrs() {
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  expertMode : false,
  imprintVisible : false,

  tools : Ember.computed("toolsAvailablem", "i18n.locale", function(){
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

  selectedTool : Ember.computed("selectedToolKey", "i18n.locale", function(){
    return Ember.A(this.get('tools')).findBy("key", this.get("selectedToolKey"));
  }),

  selectedToolClass : Ember.computed("selectedTool", function(){
    return "container-"+this.get("selectedTool.key");
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "expertModeOn" : "expertModeOff";
  }),

  test: Ember.computed("selectedToolKey", function () {
    if(this.get("selectedToolKey") === "pca"){
      return true
    }else{
      return false
    }
  }),

  handleRunPersistence: Ember.observer("model.run.timeSec", "model.run.lengthM", function () {
    this.get("model.run").save();
  }),

  handleAchievedRunPersistence: Ember.observer("model.prediction.achievedRunRaw.lengthM", "model.prediction.achievedRunRaw.timeSec", function () {
    // only save the user generated achieved runs with the dedicated id, otherwise the default value of achievedRunRaw would be saved to
    if(this.get("model.prediction.achievedRunRaw.id") === "achievedRun"){
      this.get("model.prediction.achievedRunRaw.content").save();
    }
  }),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection);
    }
  }
});
