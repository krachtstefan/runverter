import Ember from 'ember';
export default Ember.Controller.extend({

  i18n: Ember.inject.service(),

  queryParams: {
    selectedToolKey : 't',          // selected tool
    runLengthMetricsQuery : 'l',    // selected length metric
    runTempoMetricsQuery : 's',     // selected tempo metric
    expertMode : 'nerd',            // selected tool
  },

  selectedToolKey : "pca",
  runLengthMetricsQuery : "km",     // will be used to overwrite the default of the component
  runTempoMetricsQuery : "minkm",   // will be used to overwrite the default of the component

  toolsAvailable : [
    "pca", "pc", "lc", "rp", "sc"
  ],

  didInitAttrs() {
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  expertMode : false,

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
    var selectedTool = this.get("tools").findBy("key", this.get("selectedToolKey"));
    return selectedTool;
  }),

  handlePersistence: function () {
    this.get("model").save();
  }.observes("model.timeSec", "model.lengthM"),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection);
    }
  }
});
