import Ember from 'ember';
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  templates : Ember.computed("i18n.locale", function(){
    return [
      {
        'name' : this.get('i18n').t("races.10k"),
        'lengthM' : new BigNumber(10000)
      },
      {
        'name' : this.get('i18n').t("races.hm"),
        'lengthM' : new BigNumber(21097.5)
      },
      {
        'name' : this.get('i18n').t("races.m"),
        'lengthM' : new BigNumber(42195)
      },
      {
        'name' : this.get('i18n').t("races.50k"),
        'lengthM' : new BigNumber(50000)
      },
      {
        'name' : this.get('i18n').t("races.50m"),
        'lengthM' : new BigNumber(80467.2)
      },
      {
        'name' : this.get('i18n').t("races.100k"),
        'lengthM' : new BigNumber(100000)
      },
      {
        'name' : this.get('i18n').t("races.100m"),
        'lengthM' : new BigNumber(160934.4)
      }
    ];
  })
});
