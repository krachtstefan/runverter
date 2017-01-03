import DS from 'ember-data';
import Ember from 'ember';
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
  predictedRun: DS.belongsTo('run'),

  /**
   * update predictedRun on achievedRun change
   */
  onAchievedRunChange : Ember.observer("achievedRun", "achievedRun.timeSec", "achievedRun.lengthM", function() {
    this.get("achievedRun.timeSec");
    this.get("predictedRun").set("timeSec", this.get("achievedRun.timeSec"));
  }),

  /**
   * will convert the input to BigNumber if necessary. If input is BigNumber already
   * it will be left unchanged. This method is handy for setter methods of this class.
   * Setter may be called from user input (string) or other methods of this class which
   * already provide Bignumber. In the second case, it is important to keep the BigNumber
   * type to prevent precision loss
   *
   * @param  {BigNumber|string|number} input  any number like input
   * @return {BigNumber} output instance of BigNumber
   */
  _ensureBigNumber : function(input){
    return (input instanceof BigNumber) ? input : new BigNumber(+input || 0);
  }

});
