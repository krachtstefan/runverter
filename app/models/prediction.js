import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  ready: function() {
    this._super(...arguments);
    this.setProperties({
      "predictedRun" : this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)}),
      "achievedRun" : this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)})
    });
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
    var predictedSeconds = this.peterRiegelMethod(this.get("achievedRun.lengthM"), this.get("predictedRun.lengthM"), this.get("achievedRun.timeSec"));
    this.get("predictedRun").set("timeSec", predictedSeconds.toSignificantDigits(15)); // needs to be converted to 15 significant digits to be compatible to BigNumber
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
