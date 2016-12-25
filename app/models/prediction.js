import DS from 'ember-data';
// import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  /**
   * achievedRun represents the achieved run, needed to calcuate the predicted run
   */
  achievedRun: DS.belongsTo('run'),

  /**
   * predictedRun represents the predicted run, calculated from achieved run
   */
  predictedRun: DS.belongsTo('run')

});
