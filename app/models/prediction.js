import DS from 'ember-data';
// import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  ready: function() {
    this._super(...arguments);
    this.set("predictedRun", this.store.createRecord('run',{
      timeSec : new BigNumber(0),
      lengthM : new BigNumber(0)
    }));
  },

  /**
   * achievedRun represents the achieved run, needed to calcuate the predicted run
   */
  achievedRun: DS.belongsTo('run'),

  /**
   * predictedRun represents the predicted run, calculated from achieved run
   */
  predictedRun: DS.belongsTo('run')

});
