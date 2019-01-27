import Service from '@ember/service';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  i18n: service(),
  templates: computed('i18n.locale', function() {
    return [
      // 10k
      {
        name: this.get('i18n').t('targetTimes.sub1h'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(3599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub55'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(3299)
      },
      {
        name: this.get('i18n').t('targetTimes.sub50'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(2999)
      },
      {
        name: this.get('i18n').t('targetTimes.sub45'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(2699)
      },
      {
        name: this.get('i18n').t('targetTimes.sub40'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(2399)
      },
      {
        name: this.get('i18n').t('targetTimes.sub35'),
        startM: '9000',
        endM: '11000',
        timeSec: new BigNumber(2099)
      },
      // half marathon
      {
        name: this.get('i18n').t('targetTimes.sub2h10'),
        startM: '20000',
        endM: '22000',
        timeSec: new BigNumber(7799)
      },
      {
        name: this.get('i18n').t('targetTimes.sub2h'),
        startM: '20000',
        endM: '22000',
        timeSec: new BigNumber(7199)
      },
      {
        name: this.get('i18n').t('targetTimes.sub1h50'),
        startM: '20000',
        endM: '22000',
        timeSec: new BigNumber(6599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub1h40'),
        startM: '20000',
        endM: '22000',
        timeSec: new BigNumber(5999)
      },
      {
        name: this.get('i18n').t('targetTimes.sub1h30'),
        startM: '20000',
        endM: '22000',
        timeSec: new BigNumber(5399)
      },
      // marathon (and 50k)
      {
        name: this.get('i18n').t('targetTimes.sub4h30'),
        startM: '40000',
        endM: '51000',
        timeSec: new BigNumber(16199)
      },
      {
        name: this.get('i18n').t('targetTimes.sub4h15'),
        startM: '40000',
        endM: '51000',
        timeSec: new BigNumber(15299)
      },
      {
        name: this.get('i18n').t('targetTimes.sub4h'),
        startM: '40000',
        endM: '51000',
        timeSec: new BigNumber(14399)
      },
      {
        name: this.get('i18n').t('targetTimes.sub3h45'),
        startM: '40000',
        endM: '51000',
        timeSec: new BigNumber(13499)
      },
      {
        name: this.get('i18n').t('targetTimes.sub3h30'),
        startM: '40000',
        endM: '51000',
        timeSec: new BigNumber(12599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub3h15'),
        startM: '40000',
        endM: '45000',
        timeSec: new BigNumber(11699)
      },
      {
        name: this.get('i18n').t('targetTimes.sub3h'),
        startM: '40000',
        endM: '45000',
        timeSec: new BigNumber(10799)
      },
      // 50 miles
      {
        name: this.get('i18n').t('targetTimes.sub10h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(35999)
      },
      {
        name: this.get('i18n').t('targetTimes.sub9h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(32399)
      },
      {
        name: this.get('i18n').t('targetTimes.sub8h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(28799)
      },
      {
        name: this.get('i18n').t('targetTimes.sub7h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(25199)
      },
      {
        name: this.get('i18n').t('targetTimes.sub6h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(21599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub5h'),
        startM: '75000',
        endM: '85000',
        timeSec: new BigNumber(17999)
      },
      // 100k
      {
        name: this.get('i18n').t('targetTimes.sub15h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(53999)
      },
      {
        name: this.get('i18n').t('targetTimes.sub14h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(50399)
      },
      {
        name: this.get('i18n').t('targetTimes.sub13h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(46799)
      },
      {
        name: this.get('i18n').t('targetTimes.sub12h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(43199)
      },
      {
        name: this.get('i18n').t('targetTimes.sub11h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(39599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub10h'),
        startM: '95000',
        endM: '105000',
        timeSec: new BigNumber(35999)
      },
      // 100 miles
      {
        name: this.get('i18n').t('targetTimes.sub23h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(82799)
      },
      {
        name: this.get('i18n').t('targetTimes.sub22h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(79199)
      },
      {
        name: this.get('i18n').t('targetTimes.sub21h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(75599)
      },
      {
        name: this.get('i18n').t('targetTimes.sub20h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(71999)
      },
      {
        name: this.get('i18n').t('targetTimes.sub19h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(68399)
      },
      {
        name: this.get('i18n').t('targetTimes.sub18h'),
        startM: '155000',
        endM: '165000',
        timeSec: new BigNumber(64799)
      }
    ];
  })
});
