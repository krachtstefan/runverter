import Ember from 'ember';
export default Ember.Controller.extend({

  i18n: Ember.inject.service(),

  queryParams: {
    'i18n.locale' : 'l',                  // selected locale
    'selectedToolKey' : 't',              // selected tool
    'paceCalcLengthMetricsQuery' : 'lm',  // selected length metric
    'paceCalcTempoMetricsQuery' : 's',    // selected tempo metric
    'expertMode' : 'nerd',                // selected display mode
    'imprintVisible' : 'info',            // selected display mode
    'index_key' : "index_key"             // keep the index_key param provided by ember-cli-deploy
  },

  selectedToolKey : "pca",
  paceCalcLengthMetricsQuery : "km",      // will be used to overwrite the default of the component
  paceCalcTempoMetricsQuery : "minkm",    // will be used to overwrite the default of the component

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

  handlePersistence: Ember.observer("model.timeSec", "model.lengthM", function () {
    this.get("model.run").save();
  }),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection);
    }
  }
});
