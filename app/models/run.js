import DS from 'ember-data';
import Ember from 'ember';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

  /**
   * createdAt represents the creation date of the run, will be stored in database
   * and should be set on create
   *
   * @type {Date}
   */
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  /**
   * updatedAt represents the updating date of the run, will be stored in database
   * and should be set on create on on every page visit
   *
   * @type {Date}
   */
  updatedAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  /**
   * MiToM the length of a mile in meters
   *
   * @type {BigNumber} length of a mile in meters
   */
  miToM: new BigNumber(1609.344),

  /**
   * digits the number of digits for decimal values
   *
   * @type {BigNumber} number of digits
   */
  digits: new BigNumber(2),

  /**
   * timeSec represents the time of the run in seconds, will be stored in database
   * and should be set on create
   */
  timeSec: DS.attr('bignumber', {
    /**
     * @return {BigNumber} time of the run in seconds
     */
    defaultValue: function() {
      return new BigNumber(0);
    }
  }),

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
  timeHrRaw: Ember.computed("timeSec", function(){
    return this.get("timeSec").dividedBy(3600);
  }),

  /**
   * time of the run in minutes
   */
  timeMin: Ember.computed("timeMinRaw", {

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
  timeMinRaw: Ember.computed("timeSec", function(){
    return this.get("timeSec").dividedBy(60);
  }),

  /**
   * timeStackHr is used to display the time like 12:34:56 and represents the hours value
   */
  timeStackHr: Ember.computed("timeSec", "timeStackHrRaw" ,{

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
   timeStackHrRaw: Ember.computed("timeSec", function(){
    // use .get("timeSec").round() instead of .get("timeHr")
    // otherwise 3599.5 seconds would result in a timeStackHrRaw of 1
    return this.get("timeSec").round().dividedBy(3600).floor();
   }),

  /**
   * timeStackMin is used to display the time like 12:34:56 and represents the minutes value
   */
  timeStackMin: Ember.computed("timeSec", "timeStackMinRaw",{

    /**
     * returns timeStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("timeStackMinRaw").round();
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
      return this.get("timeStackMinRaw").round();
    }
  }),

  /**
   * calculates the value of timeStackMin
   *
   * @return {BigNumber}
   */
  timeStackMinRaw: Ember.computed("timeSec", "timeStackHrRaw", function(){
    // use .get("timeSec").round().dividedBy(60) instead of .get("timeMinRaw")
    // otherwise 3599.5 seconds would result in a timeStackMinRaw of 59 instead of 0
    return this.get("timeSec").round().dividedBy(60).floor().minus(this.get("timeStackHr")*60);
  }),

  /**
   * timeStackMinFixed is a variation of timeStackMin with a fixed length as
   * defined in the digits property to make it possible to display 2:1:12 as 2:01:12
   */
  timeStackMinFixed: Ember.computed("timeStackMinFixedRaw", "timeSec", {

    /**
     * returns timeStackMinFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("timeStackMinFixedRaw");
    },

    /**
     * sets a new timeStackMinFixed
     *
     * @param  {string} propertyName name of the changed property, always "timeStackMinFixed"
     * @param  {BigNumber|string|number} value new timeStackMinFixed value
     * @return {string} new timeStackMinFixed value
     */
    set: function(propertyName, value) {
      this.set("timeStackMin", value);
      return this.get("timeStackMinFixedRaw");
    },
  }),

  /**
   * calculates the value of timeStackMinFixed
   *
   * @return {string}
   */
  timeStackMinFixedRaw: Ember.computed("timeStackMin", "timeSec", function(){
    var timeStackMin = this.get("timeStackMin").toString();
    var zerosToAdd = this.get("digits").minus(timeStackMin.length);
    while (zerosToAdd--) { timeStackMin = "0"+timeStackMin; }
    return timeStackMin;
  }),


  /**
   * timeStackSec is used to display the time like 12:34:56 and represents the seconds value
   */
  timeStackSec: Ember.computed("timeSec", "timeStackSecRaw",{

    /**
     * returns timeStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var timeStackSecRaw = this.get("timeStackSecRaw").round();
      return timeStackSecRaw.equals(60) ? new BigNumber(0): timeStackSecRaw;
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

      var timeStackSecRaw = this.get("timeStackSecRaw").round();
      return timeStackSecRaw.equals(60) ? new BigNumber(0): timeStackSecRaw;
    }
  }),

  /**
   * calculates the value of timeStackSec
   *
   * @return {BigNumber}
   */
  timeStackSecRaw: Ember.computed("timeSec", "timeMinRaw",function(){
    // a combinatin of round and floor is not necessary here, because there is no smaller metric than seconds
    return this.get("timeSec").minus(this.get("timeMinRaw").floor().times(60));
  }),

  /**
   * timeStackSecFixed is a variation of timeStackSec with a fixed length as
   * defined in the digits property to make it possible to display 15:1 as 15:01
   */
  timeStackSecFixed: Ember.computed("timeStackSecFixedRaw", "timeSec", {

    /**
     * returns timeStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("timeStackSecFixedRaw");
    },

    /**
     * sets a new timeStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "timeStackSecFixed"
     * @param  {BigNumber|string|number} value new timeStackSecFixed value
     * @return {string} new timeStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set("timeStackSec", value);
      return this.get("timeStackSecFixedRaw");
    },
  }),

  /**
   * calculates the value of timeStackSecFixed
   *
   * @return {string}
   */
  timeStackSecFixedRaw: Ember.computed("timeStackSec", "timeSec", function(){
    var timeStackSec = this.get("timeStackSec").toString();
    var zerosToAdd = this.get("digits").minus(timeStackSec.length);
    while (zerosToAdd--) { timeStackSec = "0"+timeStackSec;}
    return timeStackSec;
  }),

  /**
   * lengthM represents the length of the run in meter, will be stored in database
   * and should be set on create
   */
  lengthM: DS.attr('bignumber', {
    /**
     * @return {BigNumber} length of the run in meter
     */
    defaultValue: function() {
      return new BigNumber(0);
    }
  }),

  /**
   * lengthMStackM is used to display the length like 12,34 and represents the Meter value
   */
  lengthMStackM: Ember.computed("lengthM", "lengthMStackMRaw", {

    /**
     * returns lengthMStackM, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get("lengthMStackMRaw");
    },

    /**
     * sets a new lengthMStackM
     *
     * @param  {string} propertyName name of the changed property, always "lengthMStackM"
     * @param  {BigNumber|string|number} value new lengthMStackM value
     * @return {BigNumber} new lengthMStackM value
     */
    set: function(propertyName, value) {
      var previousValue = this.get("lengthMStackMRaw");
      value = this._ensureBigNumber(value).round();
      this.set("lengthM", this.get("lengthM").plus(value.minus(previousValue)));
      return this.get("lengthMStackMRaw");
    }
  }),

  /**
   * calculates the value of lengthMStackM
   *
   * @return {BigNumber}
   */
  lengthMStackMRaw: Ember.computed("lengthM", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("lengthM").round(this.get("digits")).floor();
  }),

  /**
   * lengthMStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the meters value
   */
  lengthMStackDecimal: Ember.computed("lengthM", "lengthMStackMRaw", {

    /**
     * returns lengthMStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthMStackDecimal = this.get("lengthM").round(this.get("digits")).toString().split(".")[1];
      return lengthMStackDecimal ? lengthMStackDecimal: "0";
    },

    /**
     * sets a new lengthMStackDecimal
     *
     * @param  {string} propertyName name of the changed property, always "lengthMStackDecimal"
     * @param  {BigNumber|string|number} value new lengthMStackDecimal value
     * @return {string} new lengthMStackDecimal value
     */
    set: function(propertyName, value) {
      var leadingZeros = this._getLeadingZerosFromString(value);
      value = this._ensureBigNumber(value).round();
      var valueLength = value.abs().toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the meters from decimal place
      var decimalMeters = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros)).dividedBy(1000);

      this.set("lengthM", this.get("lengthMStackMRaw").plus(decimalMeters));

      var lengthMStackDecimal = this.get("lengthM").round(this.get("digits")).toString().split(".")[1];
      return lengthMStackDecimal ? lengthMStackDecimal: "0";
    }
  }),

  /**
   * lengthMStackDecimalFixed is a variation of lengthMStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthMStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthMStackDecimalFixed: Ember.computed("lengthMStackDecimalFixedRaw", "lengthM", {

    /**
     * returns lengthMStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("lengthMStackDecimalFixedRaw");
    },

    /**
     * sets a new lengthMStackDecimalFixed
     *
     * @param  {string} propertyName name of the changed property, always "lengthMStackDecimalFixed"
     * @param  {BigNumber|string|number} value new lengthMStackDecimalFixed value
     * @return {string} new lengthMStackDecimalFixed value
     */
    set: function(propertyName, value) {
      var valueBigNumber = this._ensureBigNumber(value); // don't change value itself, leading zeros may get lost

      // a value like 104 should result in 04 and increment the pre-decimal point position
      // the same applies for a value like -1, value should be 99 and the pre-decimal point position should be decreased
      if(valueBigNumber.round().toString().length > this.digits || valueBigNumber.isNegative() === true){
        this.set("lengthM", this.get("lengthMStackM").plus(valueBigNumber.dividedBy(100)));
      }else{
        this.set("lengthMStackDecimal", value);
      }
      return this.get("lengthMStackDecimalFixedRaw");
    },
  }),

  /**
   * calculates the value of lengthMStackDecimalFixed
   *
   * @return {string}
   */
  lengthMStackDecimalFixedRaw: Ember.computed("lengthMStackDecimal", "lengthM", function(){
    var lengthMStackDecimal = this.get("lengthMStackDecimal");
    var zerosToAdd = this.get("digits").minus(lengthMStackDecimal.length);
    while (zerosToAdd--) { lengthMStackDecimal += "0";}
    return lengthMStackDecimal;
  }),

  /**
   * length of the run in km
   */
  lengthKm: Ember.computed("lengthKmRaw", {

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
  lengthKmRaw: Ember.computed("lengthM", function(){
    return this.get("lengthM").dividedBy(1000);
  }),


  /**
   * lengthKmStackKm is used to display the length like 12,34 and represents the kilometers value
   */
  lengthKmStackKm: Ember.computed("lengthM", "lengthKmStackKmRaw", {

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
  lengthKmStackKmRaw: Ember.computed("lengthKm", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("lengthKm").round(this.get("digits")).floor();
  }),

  /**
   * lengthKmStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  lengthKmStackDecimal: Ember.computed("lengthKm", "lengthKmStackKmRaw", {

    /**
     * returns lengthKmStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthKmStackDecimal = this.get("lengthKm").round(this.get("digits")).toString().split(".")[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal: "0";
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
      var valueLength = value.abs().toString().length;


      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the meters from decimal place
      var decimalMeters = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("lengthM", this.get("lengthKmStackKmRaw").times(1000).plus(decimalMeters));

      var lengthKmStackDecimal = this.get("lengthKmRaw").round(this.get("digits")).toString().split(".")[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal: "0";
    }
  }),

  /**
   * lengthKmStackDecimalFixed is a variation of lengthKmStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthKmStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthKmStackDecimalFixed: Ember.computed("lengthKmStackDecimalFixedRaw", {

    /**
     * returns lengthKmStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("lengthKmStackDecimalFixedRaw");
    },

    /**
     * sets a new lengthKmStackDecimalFixed
     *
     * @param  {string} propertyName name of the changed property, always "lengthKmStackDecimalFixed"
     * @param  {BigNumber|string|number} value new lengthKmStackDecimalFixed value
     * @return {string} new lengthKmStackDecimalFixed value
     */
    set: function(propertyName, value) {
      var valueBigNumber = this._ensureBigNumber(value); // don't change value itself, leading zeros may get lost

      // a value like 104 should result in 04 and increment the pre-decimal point position
      // the same applies for a value like -1, value should be 99 and the pre-decimal point position should be decreased
      if(valueBigNumber.round().toString().length > this.digits || valueBigNumber.isNegative() === true){
        this.set("lengthM", this.get("lengthKmStackKm").times(1000).plus(valueBigNumber.times(10)));
      }else{
        this.set("lengthKmStackDecimal", value);
      }
      return this.get("lengthKmStackDecimalFixedRaw");
    },
  }),

  /**
   * calculates the value of lengthKmStackDecimalFixed
   *
   * @return {string}
   */
  lengthKmStackDecimalFixedRaw: Ember.computed("lengthKmStackDecimal", "lengthKmRaw", function(){
    var lengthKmStackDecimal = this.get("lengthKmStackDecimal");
    var zerosToAdd = this.get("digits").minus(lengthKmStackDecimal.length);
    while (zerosToAdd--) { lengthKmStackDecimal += "0";}
    return lengthKmStackDecimal;
  }),

  /**
   * length of the run in miles
   */
  lengthMi: Ember.computed("lengthMiRaw", {

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
  lengthMiRaw: Ember.computed("lengthM", function(){
    return this.get("lengthM").dividedBy(this.miToM);
  }),

  /**
   * lengthMiStackMi is used to display the length like 12,34 and represents the miles value
   */
  lengthMiStackMi: Ember.computed("lengthM", "lengthMiStackMiRaw", {

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
  lengthMiStackMiRaw: Ember.computed("lengthMiRaw", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("lengthMi").round(this.get("digits")).floor();
  }),

  /**
   * lengthMiStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the miles value
   */
  lengthMiStackDecimal: Ember.computed("lengthMi", "lengthMiStackMiRaw", {

    /**
     * returns lengthMiStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthMiStackDecimal = this.get("lengthMi").round(this.get("digits")).toString().split(".")[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal: "0";
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
      var valueLength = value.abs().toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the Meters from decimal place
      var decimalMiles = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));
      var decimalMeters = decimalMiles.dividedBy(1000).times(this.miToM);

      this.set("lengthM", this.get("lengthMiStackMiRaw").times(this.miToM).plus(decimalMeters));

      var lengthMiStackDecimal = this.get("lengthMiRaw").round(this.get("digits")).toString().split(".")[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal: "0";
    }
  }),

  /**
   * lengthMiStackDecimalFixed is a variation of lengthMiStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthMiStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthMiStackDecimalFixed: Ember.computed("lengthMiStackDecimalFixedRaw", {

    /**
     * returns lengthMiStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("lengthMiStackDecimalFixedRaw");
    },

    /**
     * sets a new lengthMiStackDecimalFixed
     *
     * @param  {string} propertyName name of the changed property, always "lengthMiStackDecimalFixed"
     * @param  {BigNumber|string|number} value new lengthMiStackDecimalFixed value
     * @return {string} new lengthMiStackDecimalFixed value
     */
    set: function(propertyName, value) {
      var valueBigNumber = this._ensureBigNumber(value); // don't change value itself, leading zeros may get lost

      // a value like 104 should result in 04 and increment the pre-decimal point position
      // the same applies for a value like -1, value should be 99 and the pre-decimal point position should be decreased
      if(valueBigNumber.round().toString().length > this.digits || valueBigNumber.isNegative() === true){
        this.set("lengthMi", this.get("lengthMiStackMi").plus(valueBigNumber.dividedBy(100)));
      }else{
        this.set("lengthMiStackDecimal", value);
      }
      return this.get("lengthMiStackDecimalFixedRaw");
    },
  }),

  /**
   * calculates the value of lengthMiStackDecimalFixed
   *
   * @return {string}
   */
  lengthMiStackDecimalFixedRaw: Ember.computed("lengthMiStackDecimal", "lengthKmRaw", function(){
    var lengthMiStackDecimal = this.get("lengthMiStackDecimal");
    var zerosToAdd = this.get("digits").minus(lengthMiStackDecimal.length);
    while (zerosToAdd--) { lengthMiStackDecimal += "0";}
    return lengthMiStackDecimal;
  }),

  /**
   * pace of the run in min/km
   */
  paceMinPerKm: Ember.computed("paceMinPerKmRaw", "lengthKmRaw", {

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
  paceMinPerKmRaw: Ember.computed("timeMinRaw", "lengthKmRaw", function(){
    var paceMinPerKmRaw = this.get("timeMinRaw").dividedBy(this.get("lengthKmRaw"));
    return paceMinPerKmRaw.isFinite() ? paceMinPerKmRaw: new BigNumber(0);
  }),

  /**
   * paceMinPerKmStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerKmStackMin: Ember.computed("paceMinPerKmStackMinRaw", "paceMinPerKmRaw", {

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
  paceMinPerKmStackMinRaw: Ember.computed("paceMinPerKmRaw", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("paceMinPerKm").round(this.get("digits")).floor();
  }),

  /**
   * paceMinPerKmStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerKmStackSec: Ember.computed("paceMinPerKmStackSecRaw", "paceMinPerKmRaw", {

    /**
     * returns paceMinPerKmStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var paceMinPerKmStackSec = this.get("paceMinPerKmStackSecRaw").round();
      return paceMinPerKmStackSec.equals(60) ? new BigNumber(0): paceMinPerKmStackSec;
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

      var paceMinPerKmStackSec = this.get("paceMinPerKmStackSecRaw").round();
      return paceMinPerKmStackSec.equals(60) ? new BigNumber(0): paceMinPerKmStackSec;
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerKmStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerKmStackSecRaw: Ember.computed("paceMinPerKmRaw", "paceMinPerKmStackMinRaw", function(){
    return this.get("paceMinPerKmRaw").minus(this.get("paceMinPerKmStackMinRaw")).times(60);
  }),

  /**
   * paceMinPerKmStackSecFixed is a variation of paceMinPerKmStackSec with a fixed length as
   * defined in the digits property to make it possible to display 12:4 as 12:04
   */
  paceMinPerKmStackSecFixed: Ember.computed("paceMinPerKmStackSecFixedRaw", {

    /**
     * returns paceMinPerKmStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("paceMinPerKmStackSecFixedRaw");
    },

    /**
     * sets a new paceMinPerKmStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackSecFixed"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackSecFixed value
     * @return {string} new paceMinPerKmStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set("paceMinPerKmStackSec", value);
      return this.get("paceMinPerKmStackSecFixedRaw");
    },
  }),

  /**
   * calculates the value of paceMinPerKmStackSec
   *
   * @return {string}
   */
  paceMinPerKmStackSecFixedRaw: Ember.computed("paceMinPerKmStackSec", function(){
    var paceMinPerKmStackSec = this.get("paceMinPerKmStackSec").toString();
    var zerosToAdd = this.get("digits").minus(paceMinPerKmStackSec.length);
    while (zerosToAdd--) { paceMinPerKmStackSec = "0"+paceMinPerKmStackSec; }
    return paceMinPerKmStackSec;
  }),

  /**
   * pace of the run in min/mi
   */
  paceMinPerMi: Ember.computed("paceMinPerMiRaw", "lengthMiRaw", {

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
  paceMinPerMiRaw: Ember.computed("timeMinRaw", "lengthMiRaw", function(){
    var paceMinPerMiRaw = this.get("timeMinRaw").dividedBy(this.get("lengthMiRaw"));
    return paceMinPerMiRaw.isFinite() ? paceMinPerMiRaw: new BigNumber(0);
  }),

  /**
   * paceMinPerMiStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerMiStackMin: Ember.computed("paceMinPerMiStackMinRaw", "paceMinPerMiRaw", {

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
  paceMinPerMiStackMinRaw: Ember.computed("paceMinPerMiRaw", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("paceMinPerMi").round(this.get("digits")).floor();  // TODO make test recognize why not using paceMinPerMiRaw
  }),


  /**
   * paceMinPerMiStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerMiStackSec: Ember.computed("paceMinPerMiStackSecRaw", "paceMinPerMiRaw", {

    /**
     * returns paceMinPerMiStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var paceMinPerMiStackSec = this.get("paceMinPerMiStackSecRaw").round();
      return paceMinPerMiStackSec.equals(60) ? new BigNumber(0): paceMinPerMiStackSec;
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

      var paceMinPerMiStackSec = this.get("paceMinPerMiStackSecRaw").round();
      return paceMinPerMiStackSec.equals(60) ? new BigNumber(0): paceMinPerMiStackSec;
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerMiStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerMiStackSecRaw: Ember.computed("paceMinPerMiRaw", "paceMinPerMiStackMinRaw", function(){
    return this.get("paceMinPerMiRaw").minus(this.get("paceMinPerMiStackMinRaw")).times(60);
  }),

  /**
   * paceMinPerMiStackSecFixed is a variation of paceMinPerMiStackSec with a fixed length as
   * defined in the digits property to make it possible to display 12:4 as 12:04
   */
  paceMinPerMiStackSecFixed: Ember.computed("paceMinPerMiStackSecFixedRaw", {

    /**
     * returns paceMinPerMiStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("paceMinPerMiStackSecFixedRaw");
    },

    /**
     * sets a new paceMinPerMiStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackSecFixed"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackSecFixed value
     * @return {string} new paceMinPerMiStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set("paceMinPerMiStackSec", value);
      return this.get("paceMinPerMiStackSecFixedRaw");
    },
  }),

  /**
   * calculates the value of paceMinPerMiStackSec
   *
   * @return {string}
   */
  paceMinPerMiStackSecFixedRaw: Ember.computed("paceMinPerMiStackSec", function(){
    var paceMinPerMiStackSec = this.get("paceMinPerMiStackSec").toString();
    var zerosToAdd = this.get("digits").minus(paceMinPerMiStackSec.length);
    while (zerosToAdd--) { paceMinPerMiStackSec = "0"+paceMinPerMiStackSec; }
    return paceMinPerMiStackSec;
  }),


  /**
   * speed of the run in km/h
   */
  speedKmHr: Ember.computed("speedKmHrRaw", "lengthM", {

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
  speedKmHrRaw: Ember.computed("lengthKmRaw", "timeHrRaw", function(){
    var speedKmHrRaw = this.get("lengthKmRaw").dividedBy(this.get("timeHrRaw"));
    return speedKmHrRaw.isFinite() ? speedKmHrRaw: new BigNumber(0);
  }),

  /**
   * speedKmHrStackKm is used to display the speed like 12,34 and represents the kilometers value
   */
  speedKmHrStackKm: Ember.computed("speedKmHrStackKmRaw", "speedKmHrRaw", {

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
  speedKmHrStackKmRaw: Ember.computed("speedKmHrRaw", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
   return this.get("speedKmHr").round(this.get("digits")).floor();
  }),

  /**
   * speedKmHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  speedKmHrStackDecimal: Ember.computed("speedKmHr", "speedKmHrStackKmRaw", "speedKmHrRaw", {

    /**
     * returns speedKmHrStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var speedKmHrStackDecimal = this.get("speedKmHr").round(this.get("digits")).toString().split(".")[1];
      return speedKmHrStackDecimal ? speedKmHrStackDecimal: "0";
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

      var valueLength = value.abs().toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("speedKmHr", this.get("speedKmHrStackKmRaw").plus(decimalSpeed.dividedBy(1000)));

      var speedKmHrStackDecimal = this.get("speedKmHrRaw").round(this.get("digits")).toString().split(".")[1];
      return speedKmHrStackDecimal ? speedKmHrStackDecimal: "0";
    }
  }),

  /**
   * speedKmHrStackDecimalFixed is a variation of speedKmHrStackDecimal with a fixed
   * length as defined in the digits property. It's basically speedKmHrStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  speedKmHrStackDecimalFixed: Ember.computed("speedKmHrStackDecimalFixedRaw", "speedKmHr", {

    /**
     * returns speedKmHrStackDecimalFixedRaw, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("speedKmHrStackDecimalFixedRaw");
    },

    /**
     * sets a new speedKmHrStackDecimalFixed
     *
     * @param  {string} propertyName name of the changed property, always "speedKmHrStackDecimalFixed"
     * @param  {BigNumber|string|number} value new speedKmHrStackDecimalFixed value
     * @return {string} new speedKmHrStackDecimalFixed value
     */
    set: function(propertyName, value) {
      var valueBigNumber = this._ensureBigNumber(value); // don't change value itself, leading zeros may get lost

      // a value like 104 should result in 04 and increment the pre-decimal point position
      // the same applies for a value like -1, value should be 99 and the pre-decimal point position should be decreased
      if(valueBigNumber.round().toString().length > this.digits || valueBigNumber.isNegative() === true){
        this.set("speedKmHr", this.get("speedKmHrStackKm").plus(valueBigNumber.dividedBy(100)));
      }else{
        this.set("speedKmHrStackDecimal", value);
      }
      return this.get("speedKmHrStackDecimalFixedRaw");
    },
  }),

  /**
   * calculates the value of speedKmHrStackDecimalFixed
   *
   * @return {string}
   */
  speedKmHrStackDecimalFixedRaw: Ember.computed("speedKmHrStackDecimal", "speedKmHr", function(){
    var speedKmHrStackDecimal = this.get("speedKmHrStackDecimal");
    var zerosToAdd = this.get("digits").minus(speedKmHrStackDecimal.length);
    while (zerosToAdd--) { speedKmHrStackDecimal += "0";}
    return speedKmHrStackDecimal;
  }),

  /**
   * speed of the run in mi/h
   */
  speedMiHr: Ember.computed("speedMiHrRaw", "lengthMiRaw", {

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
  speedMiHrRaw: Ember.computed("lengthMiRaw", "timeHrRaw", function(){
    var speedMiHrRaw = this.get("lengthMiRaw").dividedBy(this.get("timeHrRaw"));
    return speedMiHrRaw.isFinite() ? speedMiHrRaw: new BigNumber(0);
  }),

  /**
   * speedMiHrStackMi is used to display the speed like 12,34 and represents the miles value
   */
  speedMiHrStackMi: Ember.computed("speedMiHrStackMiRaw", "speedMiHrRaw", {

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
  speedMiHrStackMiRaw: Ember.computed("speedMiHrRaw", function(){
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get("speedMiHr").round(this.get("digits")).floor();
  }),

  /**
   * speedMiHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the miles value
   *
   */
  speedMiHrStackDecimal: Ember.computed("speedMiHr", "speedMiHrStackMiRaw", {
    /**
     * returns speedMiHrStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var speedMiHrStackDecimal = this.get("speedMiHr").round(this.get("digits")).toString().split(".")[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal: "0";
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
      var valueLength = value.abs().toString().length;

      // reflects the decimal precision of the value
      // 1 = 100; 10 = 10
      var decimalPrecision = 100/Math.pow(10, valueLength-1);

      // calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("speedMiHr", this.get("speedMiHrStackMiRaw").plus(decimalSpeed.dividedBy(1000)));

      var speedMiHrStackDecimal = this.get("speedMiHrRaw").round(this.get("digits")).toString().split(".")[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal: "0";
    }
  }),


  /**
   * speedMiHrStackDecimalFixed is a variation of speedMiHrStackDecimal with a fixed
   * length as defined in the digits property. It's basically speedMiHrStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  speedMiHrStackDecimalFixed: Ember.computed("speedMiHrStackDecimalFixedRaw", "speedMiHr", {

    /**
     * returns speedMiHrStackDecimalFixedRaw, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get("speedMiHrStackDecimalFixedRaw");
    },

    /**
     * sets a new speedMiHrStackDecimalFixed
     *
     * @param  {string} propertyName name of the changed property, always "speedMiHrStackDecimalFixed"
     * @param  {BigNumber|string|number} value new speedMiHrStackDecimalFixed value
     * @return {string} new speedMiHrStackDecimalFixed value
     */
    set: function(propertyName, value) {
      var valueBigNumber = this._ensureBigNumber(value); // don't change value itself, leading zeros may get lost

      // a value like 104 should result in 04 and increment the pre-decimal point position
      // the same applies for a value like -1, value should be 99 and the pre-decimal point position should be decreased
      if(valueBigNumber.round().toString().length > this.digits || valueBigNumber.isNegative() === true){
        this.set("speedMiHr", this.get("speedMiHrStackMi").plus(valueBigNumber.dividedBy(100)));
      }else{
        this.set("speedMiHrStackDecimal", value);
      }
      return this.get("speedMiHrStackDecimalFixedRaw");
    },
  }),

  /**
   * calculates the value of speedMiHrStackDecimalFixed
   *
   * @return {string}
   */
  speedMiHrStackDecimalFixedRaw: Ember.computed("speedMiHrStackDecimal", "speedMiHr", function(){
    var speedMiHrStackDecimal = this.get("speedMiHrStackDecimal");
    var zerosToAdd = this.get("digits").minus(speedMiHrStackDecimal.length);
    while (zerosToAdd--) { speedMiHrStackDecimal += "0";}
    return speedMiHrStackDecimal;
  }),


  /**
   * array of run objects describing the splits of a race
   *
   * @return {array}
   */
  splits: [],

  /**
   *
   * @param  {BigNumber|string|number} splitDistance distance that each splits will have (last split may differ)
   *
   * @return {boolean}
   */
  calculateSplits: function(splitDistance = new BigNumber(1000), splittingStrategy = new BigNumber(0), evenSlope = false){
    this.get("splits").clear();

    splitDistance = this._ensureBigNumber(splitDistance); // how long is a split?
    splittingStrategy = this._ensureBigNumber(splittingStrategy); // what is the spliting strategy? negative, positive or even?
    var splittingStrategySecondHalf = splittingStrategy.times(-1); // reverse splitting strategy on second half

    let splitCount = this.get("lengthM").dividedBy(splitDistance); // how many splits do we need?
    let splitCountCeiled = splitCount.ceil(); // how many splits do we need? (ceiled)
    let lastSplitDistance = this.get("lengthM").minus(splitDistance.times(splitCountCeiled.minus(1))); // if not even divisible, how long is the last split?
    let turningPointSplit = splitCountCeiled.dividedBy(2).ceil(); // split number of the turning point
    let turningPointM = this.get("lengthM").dividedBy(2); // position of the turning point
    let turningPointWithinSplit = splitCount%2 === 0 ? false : true; // is the turning point within a split or exactly at the border between two splits

    let splitTime = this.get("timeSec").dividedBy(splitCount); // how much time for a splitDistance (assume an even pacing)
    let lastSplitTime = this.get("timeSec").minus(splitTime.times(splitCountCeiled.minus(1))); // how much time for the last splitDistance (assume an even pacing)

    var averagePaceFirstHalf = this.get("paceMinPerKmRaw").plus(this.get("paceMinPerKmRaw").times(splittingStrategy).dividedBy(100));
    var averagePaceSecondHalf = this.get("paceMinPerKmRaw").plus(this.get("paceMinPerKmRaw").times(splittingStrategySecondHalf).dividedBy(100));

    var a = averagePaceFirstHalf.minus(averagePaceSecondHalf);
    var b = this.get("lengthM").dividedBy(4).minus(this.get("lengthM").dividedBy(4).times(3));
    var slope = a.dividedBy(b);
    console.log(slope.toString());

    var lengthMStack = new BigNumber(0); // how long is the entire run until the current split
    var timeSecStack = new BigNumber(0); // how much time of the entire run until the current split

    if(splitCountCeiled.greaterThan(1) === true){
      for (let i = 1; splitCountCeiled.greaterThanOrEqualTo(i); i++) {
        var thisSplitDistance = splitCountCeiled.equals(i) ? lastSplitDistance : splitDistance; // different length for last split

        var beforeTurningPoint = turningPointSplit.greaterThanOrEqualTo(i); // are we in a split that is before the turning point
        var currentSplittingStrategy = beforeTurningPoint ? splittingStrategy : splittingStrategySecondHalf; // splitting strategy of the current split
        var thisSplitTime = splitCountCeiled.equals(i) ? lastSplitTime : splitTime; // different time for last split

        var averagePaceCurrent = beforeTurningPoint ? averagePaceFirstHalf : averagePaceSecondHalf;

        // apply splitting strategy
        // check if this run has a turning point somewhere in the middle of a split and if this is the current one
        if(turningPointWithinSplit === true && turningPointSplit.equals(i)){
          var turningPointSplitDistance = turningPointM.minus(splitDistance.times(i-1));
          // determine the ratio between pre and post turning point distance
          var turningPointSplitRatio1 = turningPointSplitDistance.dividedBy(splitDistance).times(100);
          var turningPointSplitRatio2 = new BigNumber(100).minus(turningPointSplitRatio1);
          // determine the time of both splitting strategies
          var thisSplitTime1 = averagePaceFirstHalf.times(60).times(thisSplitDistance.dividedBy(1000));
          var thisSplitTime2 = averagePaceSecondHalf.times(60).times(thisSplitDistance.dividedBy(1000));
          // sum both times according to their ratio
          var time1 = thisSplitTime1.times(turningPointSplitRatio1).dividedBy(100);
          var time2 = thisSplitTime2.times(turningPointSplitRatio2).dividedBy(100);
          thisSplitTime = time1.plus(time2);
        }else{
          thisSplitTime = averagePaceCurrent.times(60).times(thisSplitDistance.dividedBy(1000));
        }

        lengthMStack = lengthMStack.plus(thisSplitDistance);
        timeSecStack = timeSecStack.plus(thisSplitTime);
        var progressDistance = lengthMStack.dividedBy(this.get("lengthM")).times(100);
        var progressTime = timeSecStack.dividedBy(this.get("timeSec")).times(100);

        var test = thisSplitTime.dividedBy(splitTime).times(100);
        var test2 = thisSplitDistance.dividedBy(splitDistance).times(100);
        var test3 = test.dividedBy(test2).times(100);
        this.get("splits").push(Ember.Object.create({
          'split' : this.store.createRecord('run', {
            timeSec : thisSplitTime,
            lengthM : thisSplitDistance
          }),
          'run' : this.store.createRecord('run', {
            timeSec : timeSecStack,
            lengthM : lengthMStack
          }),
          'progressDistance' : progressDistance.round(2).toString(),
          'progressTime' : progressTime.round(2).toString(),
          // 'progressSpeed' : thisSplitTime.dividedBy(thisSplitDistance).times(100).dividedBy(splitTime).times(100)
          'progressSpeed' : test3.toString()
        }));
      }
      return true;
    }else{
      return false;
    }
  },

  /**
   * update updatedAt before saving the run
   */
  save: function(){
    this.set("updatedAt", new Date());
    this._super(...arguments);
  },

  /**
   * check if the run is in a given distance range
   *
   * @param  {BigNumber|string|number} start start of the range in meter
   * @param  {BigNumber|string|number} end end of the range in meter
   * @return {boolean}
   */
  isInRange: function(startM, endM){
    if(this.get("lengthM").greaterThan(startM) && this.get("lengthM").lessThan(endM)){
      return true;
    }else{
      return false;
    }
  },

  /**
   * returns the number of leading zeros from a string
   *
   * @param  {string} string string that should be analyzed for leading zeros
   * @return {number} number of leading zeros
   */
  _getLeadingZerosFromString: function(string){
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
   * @param  {BigNumber|string|number} input  any number like input
   * @return {BigNumber} output instance of BigNumber
   */
  _ensureBigNumber: function(input){
    return (input instanceof BigNumber) ? input: new BigNumber(+input || 0);
  },

  /**
   * observer to prevent the length to be negative
   */
  preventNegativeLengthM: Ember.observer("lengthM", function() {
    if(this._ensureBigNumber(this.get("lengthM")).isNegative() === true){
      this.set("lengthM", new BigNumber(0));
    }
  }),

  /**
   * observer to prevent the time to be negative
   */
  preventNegativeTimeSec: Ember.observer("timeSec", function() {
    if(this._ensureBigNumber(this.get("timeSec")).isNegative() === true){
      this.set("timeSec", new BigNumber(0));
    }
  })
});
