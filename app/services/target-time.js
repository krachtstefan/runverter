import Ember from 'ember';
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  templates : Ember.computed("i18n.locale", function(){
    return [
      // half marathon
      {
        'name' : this.get('i18n').t("targetTimes.sub210"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(7799)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub2"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(7199)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub150"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(6599)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub140"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(5999)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub130"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(5399)
      },
      // marathon
      {
        'name' : this.get('i18n').t("targetTimes.sub430"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(16199)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub415"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(15299)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub4"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(14399)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub345"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(13499)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub330"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(12599)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub315"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(11699)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub3"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(10799)
      },
    ];
  })
});
