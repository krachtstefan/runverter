import FactoryGuy from 'ember-data-factory-guy';
FactoryGuy.define('prediction', {
  predictedRun: FactoryGuy.belongsTo('sub2Marathon'),
  achievedRun: FactoryGuy.belongsTo('sub4Marathon')
});
