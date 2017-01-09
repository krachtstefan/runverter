import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  ready: function() {
    this._super(...arguments);
    this.setProperties({
      "predictedRun" : this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)}),
      "achievedRunRaw" : this.store.createRecord('run', { timeSec : new BigNumber(0), lengthM : new BigNumber(0)})
    });
  },

  /**
   * achievedRunRaw represents the achieved run, needed to calcuate the predicted run
   */
  achievedRunRaw: DS.belongsTo('run'),

  /**
   * achievedRun is a proxy to achievedRunRaw to handle dependencies with
   * (observer would end in an endless loop)
   */
  achievedRun : Ember.computed("achievedRunRaw.timeSec", "achievedRunRaw.lengthM" ,{

    /**
     * returns achievedRun
     *
     * @return {Run}
     */
    get: function() {
      return this.get("achievedRunRaw");
    },

    /**
     * sets a new achievedRun and updates the predicted run
     *
     * @param  {string} propertyName name of the changed property, always "achievedRun"
     * @param  {Run} value new achievedRun value
     * @return {Run} new achievedRun value
     */
    set: function(propertyName, value) {
      this.set("achievedRunRaw", value);
      return this.get("achievedRunRaw");
    }
  }),

  /**
   * predictedRunRaw represents the predicted run, calculated from achieved run
   */
  predictedRun: DS.belongsTo('run'),

  /**
   * update predictedRun on achievedRun change
   */
  onAchievedRunChange : Ember.observer("achievedRun.timeSec", "achievedRun.lengthM", function() {
    Ember.run.once(this, function() {
      var predictedSeconds = this.peterRiegelMethod(this.get("achievedRun.lengthM"), this.get("predictedRun.lengthM"), this.get("achievedRun.timeSec"));
      this.set("predictedRun.timeSec", predictedSeconds.toSignificantDigits(15)); // needs to be converted to 15 significant digits to be compatible to BigNumber
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
