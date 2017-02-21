import FactoryGuy from 'ember-data-factory-guy';
FactoryGuy.define('run', {
  sub4Marathon: {
    timeSec : new BigNumber(14399), lengthM : new BigNumber(42195)
  },
  sub2HalfMarathon: {
    timeSec : new BigNumber(7199), lengthM : new BigNumber(21097.5)
  }
});
