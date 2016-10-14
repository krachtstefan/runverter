import Ember from 'ember';
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  templates : Ember.computed("i18n.locale", function(){
    return [
      // 10k
      {
        'name' : this.get('i18n').t("targetTimes.sub1h"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(3599)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub55"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(3299)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub50"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(2999)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub45"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(2699)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub40"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(2399)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub35"),
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(2099)
      },
      // half marathon
      {
        'name' : this.get('i18n').t("targetTimes.sub2h10"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(7799)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub2h"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(7199)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub1h50"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(6599)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub1h40"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(5999)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub1h30"),
        'startM' : "20000",
        'endM' : "22000",
        'timeSec' : new BigNumber(5399)
      },
      // marathon (and 50k)
      {
        'name' : this.get('i18n').t("targetTimes.sub4h30"),
        'startM' : "40000",
        'endM' : "51000",
        'timeSec' : new BigNumber(16199)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub4h15"),
        'startM' : "40000",
        'endM' : "51000",
        'timeSec' : new BigNumber(15299)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub4h"),
        'startM' : "40000",
        'endM' : "51000",
        'timeSec' : new BigNumber(14399)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub3h45"),
        'startM' : "40000",
        'endM' : "51000",
        'timeSec' : new BigNumber(13499)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub3h30"),
        'startM' : "40000",
        'endM' : "51000",
        'timeSec' : new BigNumber(12599)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub3h15"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(11699)
      },
      {
        'name' : this.get('i18n').t("targetTimes.sub3h"),
        'startM' : "40000",
        'endM' : "45000",
        'timeSec' : new BigNumber(10799)
      },
    ];
  })
});
