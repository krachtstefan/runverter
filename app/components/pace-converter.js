import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  tooltipPaceMinPerKm : Ember.computed("run.paceMinPerKm", "i18n.locale", function(){
    return this.get("run.paceMinPerKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minkm");
  }),

  tooltipPaceMinPerMi : Ember.computed("run.paceMinPerMi", "i18n.locale", function(){
    return this.get("run.paceMinPerMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minmi");
  }),

  tooltipSpeedKmHr : Ember.computed("run.speedKmHr", "i18n.locale", function(){
    return this.get("run.speedKmHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.kmh");
  }),

  tooltipSpeedMiHr : Ember.computed("run.speedMiHr", "i18n.locale", function(){
    return this.get("run.speedMiHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.mih");
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  })
});
