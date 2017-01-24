import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  ready: function() {
    this._super(...arguments);
    if(this.get("predictedRunRaw.content") === null){
      this.set( "predictedRunRaw", this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)}) );
    }
    if(this.get("achievedRunRaw.content") === null){
      this.set( "achievedRunRaw", this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)}) );
    }
  },

  /**
   * achievedRunRaw represents the achieved run and is needed to calcuate the predicted run,
   * changing the predicted run will also effect the achieved run
   */
  achievedRunRaw: DS.belongsTo('run'),

  /**
   * achievedRun is a proxy to achievedRunRaw to handle dependencies with predictedRun
   * using Ember.observer would end in an infinite loop
   *
   * @return {Run}
   */
  achievedRun : Ember.computed("achievedRunRaw.lengthM", "predictedRunRaw.lengthM", "predictedRunRaw.timeSec", function(){
    var achievedSeconds = this.peterRiegelMethodReversed(this.get("achievedRunRaw.lengthM"), this.get("predictedRunRaw.lengthM"), this.get("predictedRunRaw.timeSec"));
    this.set("achievedRunRaw.timeSec", new BigNumber(achievedSeconds.toSignificantDigits(15))); // needs to be converted to 15 significant digits to be compatible to BigNumber
    return this.get("achievedRunRaw");
  }),

  /**
   * predictedRunRaw represents the predicted run and is calculated from achieved run
   * changing the predicted run will also effect the achieved run
   */
  predictedRunRaw: DS.belongsTo('run'),

  /**
   * predictedRun is a proxy to predictedRunRaw to handle dependencies with achievedRun
   * using Ember.observer would end in an infinite loop
   *
   * @return {Run}
   */
  predictedRun : Ember.computed("predictedRunRaw.lengthM", "achievedRunRaw.timeSec", "achievedRunRaw.lengthM", function() {
    var predictedSeconds = this.peterRiegelMethod(this.get("achievedRunRaw.lengthM"), this.get("predictedRunRaw.lengthM"), this.get("achievedRunRaw.timeSec"));
    this.set("predictedRunRaw.timeSec", new BigNumber(predictedSeconds.toSignificantDigits(15))); // needs to be converted to 15 significant digits to be compatible to BigNumber
    return this.get("predictedRunRaw");
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
  peterRiegelMethod : function(d1, d2, t1){
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
  peterRiegelMethodReversed : function(d1, d2, t2){
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
  _ensureDecimal : function(input){
    return (input instanceof Decimal) ? input : new Decimal(+input || 0);
  }

});
