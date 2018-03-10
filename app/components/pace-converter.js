import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({

  i18n: service(),

  tooltipPaceMinPerKm : computed("run.paceMinPerKm", "i18n.locale", function(){
    return this.get("run.paceMinPerKm").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minkm");
  }),

  tooltipPaceMinPerMi : computed("run.paceMinPerMi", "i18n.locale", function(){
    return this.get("run.paceMinPerMi").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.minmi");
  }),

  tooltipSpeedKmHr : computed("run.speedKmHr", "i18n.locale", function(){
    return this.get("run.speedKmHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.kmh");
  }),

  tooltipSpeedMiHr : computed("run.speedMiHr", "i18n.locale", function(){
    return this.get("run.speedMiHr").round(5).toString().replace(".", this.get('i18n').t("metrics.separator"))+" "+this.get('i18n').t("metrics.tempo.mih");
  }),

  expertModeClass : computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  })
});
