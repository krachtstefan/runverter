import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
export default Component.extend({

  i18n: inject.service(),

  racePickerKmVisible : false,
  racePickerMiVisible : false,
  racePickerMVisible : false,

  races : inject.service('race'),

  isTouchDevice : computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  tooltipLengthKm : computed("run.lengthKm", "i18n.locale", function(){
    return this.get("run.lengthKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.km");
  }),

  tooltipLengthMi : computed("run.lengthMi", "i18n.locale", function(){
    return this.get("run.lengthMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.mi");
  }),

  tooltipLengthM : computed("run.lengthM", "i18n.locale", function(){
    return this.get("run.lengthM").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.distance.m");
  }),

  racePickerKmVisibleClass: computed('racePickerKmVisible', 'isTouchDevice', function () {
    return this.get("racePickerKmVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMiVisibleClass: computed('racePickerMiVisible', 'isTouchDevice', function () {
    return this.get("racePickerMiVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMVisibleClass: computed('racePickerMVisible', 'isTouchDevice', function () {
    return this.get("racePickerMVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  expertModeClass : computed("expertMode", function(){
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
