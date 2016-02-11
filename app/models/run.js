import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  /**
   * MiToM the length of a mile in meters
   *
   * @type {BigNumber} length of a mile in meters
   */
  miToM : new BigNumber(1609.344),

  /**
   * timeSec represents the time of a run, should be set on create
   *
   * @type {BigNumber} time of the run in seconds
   */
  timeSec : new BigNumber(0),

  /**
   * time of the run in hours
   */
  timeHr: Ember.computed("timeHrRaw", {

    /**
  	 * returns timeHr, rounded to 20 digits
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeHrRaw").round(20);
    },

    /**
     * sets a new timeHr
     *
     * @param  {string} propertyName name of the changed property, always "timeHr"
  	 * @param  {BigNumber|string|number} value new timeHr value
  	 * @return {BigNumber} new timeHr value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec", value.times(3600));
      return this.get("timeHrRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of timeHr, used for lossless calculation
   *
   * @return {BigNumber}
   */
  timeHrRaw : Ember.computed("timeSec", function(){
    return this.get("timeSec").dividedBy(3600);
  }),

  /**
   * time of the run in minutes
   */
  timeMin : Ember.computed("timeMinRaw", {

    /**
  	 * returns timeMin, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeMinRaw").round(20);
    },

    /**
     * sets a new timeMin
     *
     * @param  {string} propertyName name of the changed property, always "timeMin"
  	 * @param  {BigNumber|string|number} value new timeMin value
  	 * @return {BigNumber} new timeMin value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec", value.times(60));
      return this.get("timeMinRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of timeMin, used for lossless calculation
   *
   * @return {BigNumber}
   */
  timeMinRaw : Ember.computed("timeSec", function(){
    return this.get("timeSec").dividedBy(60);
  }),

  /**
   * timeStackHr is used to display the time like 12:34:56 and represents the hours value
   */
  timeStackHr : Ember.computed("timeSec", "timeStackHrRaw" ,{

    /**
     * returns timeStackHr, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeStackHrRaw");
    },

    /**
     * sets a new timeStackHr
     *
     * @param  {string} propertyName name of the changed property, always "timeStackHr"
   	 * @param  {BigNumber|string|number} value new timeStackHr value
   	 * @return {BigNumber} new timeStackHr value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("timeStackHrRaw");
      value = this._ensureBigNumber(value).round();
      this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue).times(3600)));
      return this.get("timeStackHrRaw");
    }
  }),

   /**
    * calculates the value of timeStackHr
    *
    * @return {BigNumber}
    */
   timeStackHrRaw : Ember.computed("timeHr", function(){
     return this.get("timeHr").floor();
   }),

  /**
   * timeStackMin is used to display the time like 12:34:56 and represents the minutes value
   */
  timeStackMin : Ember.computed("timeSec", "timeStackMinRaw",{

    /**
     * returns timeStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeStackMinRaw");
    },

    /**
     * sets a new timeStackMin
     *
     * @param  {string} propertyName name of the changed property, always "timeStackMin"
     * @param  {BigNumber|string|number} value new timeStackMin value
     * @return {BigNumber} new timeStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("timeStackMinRaw");
      value = this._ensureBigNumber(value).round();
      this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue).times(60)));
      return this.get("timeStackMinRaw");
    }
  }),

  /**
   * calculates the value of timeStackMin
   *
   * @return {BigNumber}
   */
  timeStackMinRaw : Ember.computed("timeMinRaw", "timeStackHrRaw", function(){
    return this.get("timeMinRaw").floor().minus(this.get("timeStackHrRaw")*60);
  }),

  /**
   * timeStackSec is used to display the time like 12:34:56 and represents the seconds value
   */
  timeStackSec : Ember.computed("timeSec", "timeStackSecRaw",{

    /**
     * returns timeStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeStackSecRaw");
    },

    /**
     * sets a new timeStackSec
     *
     * @param  {string} propertyName name of the changed property, always "timeStackSec"
     * @param  {BigNumber|string|number} value new timeStackSec value
     * @return {BigNumber} new timeStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("timeStackSecRaw");
      value = this._ensureBigNumber(value).round();
      this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue)));
      return this.get("timeStackSecRaw");
    }
  }),

  /**
   * calculates the value of timeStackSec
   *
   * @return {BigNumber}
   */
  timeStackSecRaw : Ember.computed("timeSec", "timeMinRaw",function(){
    return this.get("timeSec").minus(this.get("timeMinRaw").floor().times(60));
  }),

  /**
   * lengthM represents the length of a run in meter, should be set on create
   *
   * @type {BigNumber} length of the run in meter
   */
  lengthM : new BigNumber(0),

  /**
   * length of the run in km
   */
  lengthKm : Ember.computed("lengthKmRaw", {

    /**
     * returns lengthKm, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("lengthKmRaw").round(20);
    },

    /**
     * sets a new lengthKm
     *
     * @param  {string} propertyName name of the changed property, always "lengthKm"
     * @param  {BigNumber|string|number} value new lengthKm value
     * @return {BigNumber} new lengthKm value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("lengthM", value.times(1000));
      return this.get("lengthKmRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of lengthKm, used for lossless calculation
   *
   * @return {BigNumber}
   */
  lengthKmRaw : Ember.computed("lengthM", function(){
    return this.get("lengthM").dividedBy(1000);
  }),


  /**
   * lengthKmStackKm is used to display the length like 12,34 and represents the kilometers value
   */
  lengthKmStackKm : Ember.computed("lengthM", "lengthKmStackKmRaw", {

    /**
     * returns lengthKmStackKm, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("lengthKmStackKmRaw");
    },

    /**
     * sets a new lengthKmStackKm
     *
     * @param  {string} propertyName name of the changed property, always "lengthKmStackKm"
     * @param  {BigNumber|string|number} value new lengthKmStackKm value
     * @return {BigNumber} new lengthKmStackKm value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("lengthKmStackKmRaw");
      value = this._ensureBigNumber(value).round();
      this.set("lengthM", this.get("lengthM").plus(value.minus(previousValue).times(1000)));
      return this.get("lengthKmStackKmRaw");
    }
  }),

  /**
   * calculates the value of lengthKmStackKm
   *
   * @return {BigNumber}
   */
  lengthKmStackKmRaw : Ember.computed("lengthKmRaw", function(){
    return this.get("lengthKmRaw").floor();
  }),

  /**
   * lengthKmStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  lengthKmStackDecimal : Ember.computed("lengthKmRaw", "lengthKmStackKmRaw", {

    /**
     * returns lengthKmStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthKmStackDecimal = this.get("lengthKmRaw").round(2).toString().split(".")[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal : "0";
    },

    /**
     * sets a new lengthKmStackDecimal
     *
     * @param  {string} propertyName name of the changed property, always "lengthKmStackDecimal"
     * @param  {BigNumber|string|number} value new lengthKmStackDecimal value
     * @return {string} new lengthKmStackDecimal value
     */
    set: function(propertyName, value) {
      var leadingZeros = this._getLeadingZerosFromString(value);
      value = this._ensureBigNumber(value).round();
      var valueLength = value.toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the meters from decimal place
      var decimalMeters = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("lengthM", this.get("lengthKmStackKmRaw").times(1000).plus(decimalMeters));

      var lengthKmStackDecimal = this.get("lengthKmRaw").round(2).toString().split(".")[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal : "0";
    }
  }),

  /**
   * length of the run in miles
   */
  lengthMi : Ember.computed("lengthMiRaw", {

    /**
     * returns lengthMi, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("lengthMiRaw").round(20);
    },

    /**
     * sets a new lengthMi
     *
     * @param  {string} propertyName name of the changed property, always "lengthMi"
     * @param  {BigNumber|string|number} value new lengthMi value
     * @return {BigNumber} new lengthMi value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("lengthM", value.times(this.miToM));
      return this.get("lengthMiRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of lengthMi, used for lossless calculation
   *
   * @return {BigNumber}
   */
  lengthMiRaw : Ember.computed("lengthM", function(){
    return this.get("lengthM").dividedBy(this.miToM);
  }),

  /**
   * lengthMiStackMi is used to display the length like 12,34 and represents the miles value
   */
  lengthMiStackMi : Ember.computed("lengthM", "lengthMiStackMiRaw", {

    /**
     * returns lengthMiStackMi, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("lengthMiStackMiRaw");
    },

    /**
     * sets a new lengthMiStackMi
     *
     * @param  {string} propertyName name of the changed property, always "lengthMiStackMi"
     * @param  {BigNumber|string|number} value new lengthMiStackMi value
     * @return {BigNumber} new lengthMiStackMi value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("lengthMiStackMiRaw");
      value = this._ensureBigNumber(value).round();
      this.set("lengthM", this.get("lengthM").plus(value.minus(previousValue).times(this.miToM)));
      return this.get("lengthMiStackMiRaw");
    }
  }),

  /**
   * calculates the value of lengthMiStackMi
   *
   * @return {BigNumber}
   */
  lengthMiStackMiRaw : Ember.computed("lengthMiRaw", function(){
    return this.get("lengthMiRaw").floor();
  }),

  /**
   * lengthMiStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the miles value
   */
  lengthMiStackDecimal : Ember.computed("lengthMiRaw", "lengthMiStackMiRaw", {

    /**
     * returns lengthMiStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthMiStackDecimal = this.get("lengthMiRaw").round(2).toString().split(".")[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal : "0";
    },

    /**
     * sets a new lengthMiStackDecimal
     *
     * @param  {string} propertyName name of the changed property, always "lengthMiStackDecimal"
     * @param  {BigNumber|string|number} value new lengthMiStackDecimal value
     * @return {string} new lengthMiStackDecimal value
     */
    set: function(propertyName, value) {
      var leadingZeros = this._getLeadingZerosFromString(value);

      value = this._ensureBigNumber(value).round();
      var valueLength = value.toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the Meters from decimal place
      var decimalMiles = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));
      var decimalMeters = decimalMiles.dividedBy(1000).times(this.miToM);

      this.set("lengthM", this.get("lengthMiStackMiRaw").times(this.miToM).plus(decimalMeters));

      var lengthMiStackDecimal = this.get("lengthMiRaw").round(2).toString().split(".")[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal : "0";
    }
  }),

  /**
   * pace of the run in min/km
   */
  paceMinPerKm : Ember.computed("paceMinPerKmRaw", "lengthKmRaw", {

    /**
     * returns paceMinPerKm, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerKmRaw").round(20);
    },

    /**
     * sets a new paceMinPerKm
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKm"
     * @param  {BigNumber|string|number} value new paceMinPerKm value
     * @return {BigNumber} new paceMinPerKm value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",value.times(this.get("lengthKmRaw").times(60)));

      return this.get("paceMinPerKmRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerKm, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerKmRaw : Ember.computed("timeMinRaw", "lengthKmRaw", function(){
    return this.get("timeMinRaw").dividedBy(this.get("lengthKmRaw"));
  }),

  /**
   * paceMinPerKmStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerKmStackMin : Ember.computed("paceMinPerKmStackMinRaw", "paceMinPerKmRaw", {

    /**
     * returns paceMinPerKmStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerKmStackMinRaw");
    },

    /**
     * sets a new paceMinPerKmStackMin
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackMin"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackMin value
     * @return {BigNumber} new paceMinPerKmStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerKmStackMinRaw");
      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerKm", this.get("paceMinPerKmRaw").plus(value.minus(previousValue)));

      return this.get("paceMinPerKmStackMinRaw");
    }
  }),

  /**
   * calculates the value of paceMinPerKmStackMin
   *
   * @return {BigNumber}
   */
  paceMinPerKmStackMinRaw : Ember.computed("paceMinPerKmRaw", function(){
    return this.get("paceMinPerKmRaw").floor();
  }),

  /**
   * paceMinPerKmStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerKmStackSec : Ember.computed("paceMinPerKmStackSecRaw", "paceMinPerKmRaw", {

    /**
     * returns paceMinPerKmStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerKmStackSecRaw").round();
    },

    /**
     * sets a new paceMinPerKmStackSec
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackSec"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackSec value
     * @return {BigNumber} new paceMinPerKmStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerKmStackSecRaw");

      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerKm", this.get("paceMinPerKmRaw").plus(value.minus(previousValue).dividedBy(60)));

      return this.get("paceMinPerKmStackSecRaw").round();
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerKmStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerKmStackSecRaw : Ember.computed("paceMinPerKmRaw", "paceMinPerKmStackMinRaw", function(){
    return this.get("paceMinPerKmRaw").minus(this.get("paceMinPerKmStackMinRaw")).times(60);
  }),


  /**
   * pace of the run in min/mi
   */
  paceMinPerMi : Ember.computed("paceMinPerMiRaw", "lengthMiRaw", {

    /**
     * returns paceMinPerMi, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerMiRaw").round(20);
    },

    /**
    * sets a new paceMinPerMi
    *
    * @param  {string} propertyName name of the changed property, always "paceMinPerMi"
    * @param  {BigNumber|string|number} value new paceMinPerMi value
    * @return {BigNumber} new paceMinPerMi value
    */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",value.times(this.get("lengthMiRaw").times(60)));

      return this.get("paceMinPerMiRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerMi, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerMiRaw : Ember.computed("timeMinRaw", "lengthMiRaw", function(){
    return this.get("timeMinRaw").dividedBy(this.get("lengthMiRaw"));
  }),

  /**
   * paceMinPerMiStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerMiStackMin : Ember.computed("paceMinPerMiStackMinRaw", "paceMinPerMiRaw", {

    /**
     * returns paceMinPerMiStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerMiStackMinRaw");
    },

    /**
     * sets a new paceMinPerMiStackMin
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackMin"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackMin value
     * @return {BigNumber} new paceMinPerMiStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerMiStackMinRaw");
      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get("paceMinPerMiRaw").plus(value.minus(previousValue)));

      return this.get("paceMinPerMiStackMinRaw");
    }
  }),

  /**
   * calculates the value of paceMinPerMiStackMin
   *
   * @return {BigNumber}
   */
  paceMinPerMiStackMinRaw : Ember.computed("paceMinPerMiRaw", function(){
    return this.get("paceMinPerMiRaw").floor();
  }),


  /**
   * paceMinPerMiStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerMiStackSec : Ember.computed("paceMinPerMiStackSecRaw", "paceMinPerMiRaw", {

    /**
     * returns paceMinPerMiStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("paceMinPerMiStackSecRaw").round();
    },

    /**
     * sets a new paceMinPerMiStackSec
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackSec"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackSec value
     * @return {BigNumber} new paceMinPerMiStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerMiStackSecRaw");
      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get("paceMinPerMiRaw").plus(value.minus(previousValue).dividedBy(60)));

      return this.get("paceMinPerMiStackSecRaw").round();
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerMiStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerMiStackSecRaw : Ember.computed("paceMinPerMiRaw", "paceMinPerMiStackMinRaw", function(){
    return this.get("paceMinPerMiRaw").minus(this.get("paceMinPerMiStackMinRaw")).times(60);
  }),


  /**
   * speed of the run in km/h
   */
  speedKmHr : Ember.computed("speedKmHrRaw", "lengthM", {

    /**
     * returns speedKmHr, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("speedKmHrRaw").round(20);
    },

    /**
     * sets a new speedKmHr
     *
     * @param  {string} propertyName name of the changed property, always "speedKmHr"
     * @param  {BigNumber|string|number} value new speedKmHr value
     * @return {BigNumber} new speedKmHr value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",this.get("lengthM").dividedBy(value).times(3.6));

      return this.get("speedKmHrRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of speedKmHrRaw, used for lossless calculation
   *
   * @return {BigNumber}
   */
  speedKmHrRaw : Ember.computed("lengthKmRaw", "timeHrRaw", function(){
    return this.get("lengthKmRaw").dividedBy(this.get("timeHrRaw"));
  }),

  /**
   * speedKmHrStackKm is used to display the speed like 12,34 and represents the kilometers value
   */
  speedKmHrStackKm : Ember.computed("speedKmHrStackKmRaw", "speedKmHrRaw", {

    /**
     * returns speedKmHrStackKm, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("speedKmHrStackKmRaw");
    },

    /**
     * sets a new speedKmHrStackKm
     *
     * @param  {string} propertyName name of the changed property, always "speedKmHrStackKm"
     * @param  {BigNumber|string|number} value new speedKmHrStackKm value
     * @return {BigNumber} new speedKmHrStackKm value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("speedKmHrStackKmRaw");
      value = this._ensureBigNumber(value).round();
      this.set("speedKmHr", this.get("speedKmHrRaw").plus(value.minus(previousValue)));

      return this.get("speedKmHrStackKmRaw");
    }
  }),

  /**
   * calculates the value of speedKmHrStackKmRaw
   *
   * @return {BigNumber}
   */
  speedKmHrStackKmRaw : Ember.computed("speedKmHrRaw", function(){
    return this.get("speedKmHrRaw").floor();
  }),

  /**
   * speedKmHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  speedKmHrStackDecimal : Ember.computed("speedKmHr", "speedKmHrStackKmRaw", "speedKmHrRaw", {

    /**
     * returns speedKmHrStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var speedKmHrStackDecimal = this.get("speedKmHr").round(2).toString().split(".")[1];
      return speedKmHrStackDecimal ? speedKmHrStackDecimal : "0";
    },

    /**
     * sets a new speedKmHrStackDecimal
     *
     * @param  {string} propertyName name of the changed property, always "speedKmHrStackDecimal"
     * @param  {BigNumber|string|number} value new speedKmHrStackDecimal value
     * @return {string} new speedKmHrStackDecimal value
     */
    set: function(propertyName, value) {
      var leadingZeros = this._getLeadingZerosFromString(value);

      value = this._ensureBigNumber(value).round();
      var valueLength = value.toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("speedKmHr", this.get("speedKmHrStackKmRaw").plus(decimalSpeed.dividedBy(1000)));

      var speedKmHrStackDecimal = this.get("speedKmHrRaw").round(2).toString().split(".")[1];
      return speedKmHrStackDecimal ? speedKmHrStackDecimal : "0";
    }
  }),

  /**
   * speed of the run in mi/h
   */
  speedMiHr : Ember.computed("speedMiHrRaw", "lengthMiRaw", {

    /**
     * returns speedMiHr, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("speedMiHrRaw").round(20);
    },

    /**
     * sets a new speedMiHr
     *
     * @param  {string} propertyName name of the changed property, always "speedMiHr"
     * @param  {BigNumber|string|number} value new speedMiHr value
     * @return {BigNumber} new speedMiHr value
     */
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeHr",this.get("lengthMiRaw").dividedBy(value));

      return this.get("speedMiHrRaw").round(20);
    }
  }),

  /**
   * calculates the uncompressed value of speedMiHr, used for lossless calculation
   *
   * @return {BigNumber}
   */
  speedMiHrRaw : Ember.computed("lengthMiRaw", "timeHrRaw", function(){
    return this.get("lengthMiRaw").dividedBy(this.get("timeHrRaw"));
  }),

  /**
   * speedMiHrStackMi is used to display the speed like 12,34 and represents the miles value
   */
  speedMiHrStackMi : Ember.computed("speedMiHrStackMiRaw", "speedMiHrRaw", {

    /**
     * returns speedMiHrStackMi, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("speedMiHrStackMiRaw");
    },

    /**
     * sets a new speedMiHrStackMi
     *
     * @param  {string} propertyName name of the changed property, always "speedMiHrStackMi"
     * @param  {BigNumber|string|number} value new speedMiHrStackMi value
     * @return {BigNumber} new speedMiHrStackMi value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("speedMiHrStackMiRaw");
      value = this._ensureBigNumber(value).round();
      this.set("speedMiHr", this.get("speedMiHrRaw").plus(value.minus(previousValue)));

      return this.get("speedMiHrStackMiRaw");
    }
  }),

  /**
   * calculates the value of speedMiHrStackMi
   *
   * @return {BigNumber}
   */
  speedMiHrStackMiRaw : Ember.computed("speedMiHrRaw", function(){
    return this.get("speedMiHrRaw").floor();
  }),

  /**
   * speedMiHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the miles value
   *
   */
  speedMiHrStackDecimal : Ember.computed("speedMiHrRaw", "speedMiHrStackMiRaw", {
    /**
    * returns speedMiHrStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var speedMiHrStackDecimal = this.get("speedMiHrRaw").round(2).toString().split(".")[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal : "0";
    },

    /**
     * sets a new speedMiHrStackDecimal
     *
     * @param  {string} propertyName name of the changed property, always "speedMiHrStackDecimal"
     * @param  {BigNumber|string|number} value new speedMiHrStackDecimal value
     * @return {string} new speedMiHrStackDecimal value
     */
    set: function(propertyName, value) {
      var leadingZeros = this._getLeadingZerosFromString(value);

      value = this._ensureBigNumber(value).round();
      var valueLength = value.toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("speedMiHr", this.get("speedMiHrStackMiRaw").plus(decimalSpeed.dividedBy(1000)));

      var speedMiHrStackDecimal = this.get("speedMiHrRaw").round(2).toString().split(".")[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal : "0";
    }
  }),

  /**
   * returns the number of leading zeros from a string
   *
   * @param  {string} string string that should be analyzed for leading zeros
   * @return {number}        number of leading zeros
   */
  _getLeadingZerosFromString : function(string){
    var leadingZeros = 0;
   	while (string[0]==="0") {
      string = string.substring(1);
    	leadingZeros ++;
    }
    return leadingZeros;
  },

  /**
   * will convert the input to BigNumber if necessary. If input is BigNumber already
   * it will be left unchanged. This method is handy for setter methods of this class.
   * Setter may be called from user input (string) or other methods of this class which
   * already provide Bignumber. In the second case, it is important to keep the BigNumber
   * type to prevent precision loss
   *
   * @param  {BigNumber|string|number}   input      any number like input
   * @return {BigNumber}                            output instance of BigNumber
   */
  _ensureBigNumber : function(input){
    return (input instanceof BigNumber) ? input : new BigNumber(+input || 0);
  }
});
