import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  ready: function() {
    this._super(...arguments);
    if(this.get("predictedRun.content") === null){
      this.set( "predictedRun", this.store.createRecord('run', { timeSec : new BigNumber(60), lengthM : new BigNumber(3400)}) );
    }
    if(this.get("achievedRun.content") === null){
      this.set( "achievedRun", this.store.createRecord('run', { timeSec : new BigNumber(120), lengthM : new BigNumber(6000)}) );
    }
  },

  /**
   * achievedRun represents the achieved run and is needed to calcuate the predicted run,
   * changing the predicted run will also effect the achieved run
   */
  achievedRun: DS.belongsTo('run'),

  /**
   * updateAchievedRunSec updates the time of the achieved run, should have been an observer but would end up in an infinite loop
   *
   * @return {Run} achieved run
   */
  updateAchievedRunSec: function() {
    var achievedSeconds = this.peterRiegelMethodReversed(this.get("achievedRun.lengthM"), this.get("predictedRun.lengthM"), this.get("predictedRun.timeSec"));
    return this.set("achievedRun.timeSec", new BigNumber(achievedSeconds.toSignificantDigits(15))); // needs to be converted to 15 significant digits to be compatible to BigNumber
  },

  /**
   * predictedRun represents the predicted run and is calculated from achieved run
   * changing the predicted run will also effect the achieved run
   */
  predictedRun: DS.belongsTo('run'),

  /**
   * updatePredictedRunSec updates the time of the predicted run when necessary
   */
  updatePredictedRunSec: Ember.observer("achievedRun.timeSec", "achievedRun.lengthM", "predictedRun.lengthM" , function() {
    Ember.run.once(this, function() {
      var predictedSeconds = this.peterRiegelMethod(this.get("achievedRun.lengthM"), this.get("predictedRun.lengthM"), this.get("achievedRun.timeSec"));
      this.set("predictedRun.timeSec", new BigNumber(predictedSeconds.toSignificantDigits(15))); // needs to be converted to 15 significant digits to be compatible to BigNumber
    });
  }),

  /**
   * Peter Riegels mathematical formula for predicting race times for runners and other athletes given
   * a certain performance at another distance T2=T1×(D2÷D1)^1.06
   *
   * @param {Decimal} d1 distance over which the initial time is achieved
   * @param {Decimal} d2 distance for which the time is to be predicted.
   * @param {Decimal} t1 is the time achieved for d1
   * @return {Decimal} predicted time
   */
  peterRiegelMethod: function(d1, d2, t1){
    d1 = this._ensureDecimal(d1);
    d2 = this._ensureDecimal(d2);
    t1 = this._ensureDecimal(t1);
    return d1.isZero() ? d1 : t1.times(d2.dividedBy(d1).pow(1.06));
  },

  /**
   * Reverse function of the Peter Riegel method to estimate the the time of an archieved run based
   * on the predicted run
   *
   * @param {Decimal} d1 distance over which the initial time is achieved
   * @param {Decimal} d2 distance for which the time is to be predicted.
   * @param {Decimal} t2 is the time predicted for d2
   * @return {Decimal} predicted time
   */
  peterRiegelMethodReversed: function(d1, d2, t2){
    d1 = this._ensureDecimal(d1);
    d2 = this._ensureDecimal(d2);
    t2 = this._ensureDecimal(t2);
    return d1.isZero() ? d1 : t2.dividedBy(d2.dividedBy(d1).pow(1.06));
  },

  /**
   * will convert the input to Decimal if necessary. If input is Decimal already
   * it will be left unchanged. This method is handy for setter methods of this class.
   * Setter may be called from user input (string) or other methods of this class which
   * already provide Decimal. In the second case, it is important to keep the Decimal
   * type to prevent precision loss
   *
   * @param  {Decimal|string|number} input  any number like input
   * @return {Decimal} output instance of Decimal
   */
  _ensureDecimal: function(input){
    return (input instanceof Decimal) ? input : new Decimal(+input || 0);
  }

});
