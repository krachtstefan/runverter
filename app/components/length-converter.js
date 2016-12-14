import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  races : Ember.inject.service('race'),

  isTouchDevice : Ember.computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  tooltipLengthKm : Ember.computed("run.lengthKm", "i18n.locale", function(){
    return this.get("run.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipLengthMi : Ember.computed("run.lengthMi", "i18n.locale", function(){
    return this.get("run.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  tooltipLengthM : Ember.computed("run.lengthM", "i18n.locale", function(){
    return this.get("run.lengthM").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.m");
  }),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "lc" ? true : false;
  }),

  racePickerKmVisibleClass: Ember.computed('isTouchDevice', function () {
    return this.get("isTouchDevice") ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMiVisibleClass: Ember.computed('isTouchDevice', function () {
    return this.get("isTouchDevice") ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMVisibleClass: Ember.computed('isTouchDevice', function () {
    return this.get("isTouchDevice") ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-3-5";
  }),

  actions: {
    setRace: function(race) {
      if(race !== null){
        this.get("run").set("lengthM",race.lengthM);
      }
    }
  }
});
