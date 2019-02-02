import DS from 'ember-data';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
BigNumber.config({ DECIMAL_PLACES: 25 });
export default DS.Model.extend({
  /**
   * createdAt represents the creation date of the run, will be stored in database
   * and should be set on create
   *
   * @type {Date}
   */
  createdAt: DS.attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  /**
   * updatedAt represents the updating date of the run, will be stored in database
   * and should be set on create on on every page visit
   *
   * @type {Date}
   */
  updatedAt: DS.attr('date', {
    defaultValue() {
      return new Date();
    }
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
  timeHr: computed('timeHrRaw', {
    /**
     * returns timeHr, rounded to 20 digits
     * @return {BigNumber}
     */
    get: function() {
      return this.get('timeHrRaw').round(20);
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
      this.set('timeSec', value.times(3600));
      return this.get('timeHrRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of timeHr, used for lossless calculation
   *
   * @return {BigNumber}
   */
  timeHrRaw: computed('timeSec', function() {
    return this.get('timeSec').dividedBy(3600);
  }),

  /**
   * time of the run in minutes
   */
  timeMin: computed('timeMinRaw', {
    /**
     * returns timeMin, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('timeMinRaw').round(20);
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
      this.set('timeSec', value.times(60));
      return this.get('timeMinRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of timeMin, used for lossless calculation
   *
   * @return {BigNumber}
   */
  timeMinRaw: computed('timeSec', function() {
    return this.get('timeSec').dividedBy(60);
  }),

  /**
   * timeStackHr is used to display the time like 12:34:56 and represents the hours value
   */
  timeStackHr: computed('timeSec', 'timeStackHrRaw', {
    /**
     * returns timeStackHr, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('timeStackHrRaw');
    },

    /**
     * sets a new timeStackHr
     *
     * @param  {string} propertyName name of the changed property, always "timeStackHr"
     * @param  {BigNumber|string|number} value new timeStackHr value
     * @return {BigNumber} new timeStackHr value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('timeStackHrRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'timeSec',
        this.get('timeSec').plus(value.minus(previousValue).times(3600))
      );
      return this.get('timeStackHrRaw');
    }
  }),

  /**
   * calculates the value of timeStackHr
   *
   * @return {BigNumber}
   */
  timeStackHrRaw: computed('timeSec', function() {
    // use .get("timeSec").round() instead of .get("timeHr")
    // otherwise 3599.5 seconds would result in a timeStackHrRaw of 1
    return this.get('timeSec')
      .round()
      .dividedBy(3600)
      .floor();
  }),

  /**
   * timeStackMin is used to display the time like 12:34:56 and represents the minutes value
   */
  timeStackMin: computed('timeSec', 'timeStackMinRaw', {
    /**
     * returns timeStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('timeStackMinRaw').round();
    },

    /**
     * sets a new timeStackMin
     *
     * @param  {string} propertyName name of the changed property, always "timeStackMin"
     * @param  {BigNumber|string|number} value new timeStackMin value
     * @return {BigNumber} new timeStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('timeStackMinRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'timeSec',
        this.get('timeSec').plus(value.minus(previousValue).times(60))
      );
      return this.get('timeStackMinRaw').round();
    }
  }),

  /**
   * calculates the value of timeStackMin
   *
   * @return {BigNumber}
   */
  timeStackMinRaw: computed('timeSec', 'timeStackHrRaw', function() {
    // use .get("timeSec").round().dividedBy(60) instead of .get("timeMinRaw")
    // otherwise 3599.5 seconds would result in a timeStackMinRaw of 59 instead of 0
    return this.get('timeSec')
      .round()
      .dividedBy(60)
      .floor()
      .minus(this.get('timeStackHr') * 60);
  }),

  /**
   * timeStackMinFixed is a variation of timeStackMin with a fixed length as
   * defined in the digits property to make it possible to display 2:1:12 as 2:01:12
   */
  timeStackMinFixed: computed('timeStackMinFixedRaw', 'timeSec', {
    /**
     * returns timeStackMinFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('timeStackMinFixedRaw');
    },

    /**
     * sets a new timeStackMinFixed
     *
     * @param  {string} propertyName name of the changed property, always "timeStackMinFixed"
     * @param  {BigNumber|string|number} value new timeStackMinFixed value
     * @return {string} new timeStackMinFixed value
     */
    set: function(propertyName, value) {
      this.set('timeStackMin', value);
      return this.get('timeStackMinFixedRaw');
    }
  }),

  /**
   * calculates the value of timeStackMinFixed
   *
   * @return {string}
   */
  timeStackMinFixedRaw: computed('timeStackMin', 'timeSec', function() {
    var timeStackMin = this.get('timeStackMin').toString();
    var zerosToAdd = this.get('digits').minus(timeStackMin.length);
    while (zerosToAdd--) {
      timeStackMin = '0' + timeStackMin;
    }
    return timeStackMin;
  }),

  /**
   * timeStackSec is used to display the time like 12:34:56 and represents the seconds value
   */
  timeStackSec: computed('timeSec', 'timeStackSecRaw', {
    /**
     * returns timeStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var timeStackSecRaw = this.get('timeStackSecRaw').round();
      return timeStackSecRaw.equals(60) ? new BigNumber(0) : timeStackSecRaw;
    },

    /**
     * sets a new timeStackSec
     *
     * @param  {string} propertyName name of the changed property, always "timeStackSec"
     * @param  {BigNumber|string|number} value new timeStackSec value
     * @return {BigNumber} new timeStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('timeStackSecRaw');
      value = this._ensureBigNumber(value).round();
      this.set('timeSec', this.get('timeSec').plus(value.minus(previousValue)));

      var timeStackSecRaw = this.get('timeStackSecRaw').round();
      return timeStackSecRaw.equals(60) ? new BigNumber(0) : timeStackSecRaw;
    }
  }),

  /**
   * calculates the value of timeStackSec
   *
   * @return {BigNumber}
   */
  timeStackSecRaw: computed('timeSec', 'timeMinRaw', function() {
    // a combinatin of round and floor is not necessary here, because there is no smaller metric than seconds
    return this.get('timeSec').minus(
      this.get('timeMinRaw')
        .floor()
        .times(60)
    );
  }),

  /**
   * timeStackSecFixed is a variation of timeStackSec with a fixed length as
   * defined in the digits property to make it possible to display 15:1 as 15:01
   */
  timeStackSecFixed: computed('timeStackSecFixedRaw', 'timeSec', {
    /**
     * returns timeStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('timeStackSecFixedRaw');
    },

    /**
     * sets a new timeStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "timeStackSecFixed"
     * @param  {BigNumber|string|number} value new timeStackSecFixed value
     * @return {string} new timeStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set('timeStackSec', value);
      return this.get('timeStackSecFixedRaw');
    }
  }),

  /**
   * calculates the value of timeStackSecFixed
   *
   * @return {string}
   */
  timeStackSecFixedRaw: computed('timeStackSec', 'timeSec', function() {
    var timeStackSec = this.get('timeStackSec').toString();
    var zerosToAdd = this.get('digits').minus(timeStackSec.length);
    while (zerosToAdd--) {
      timeStackSec = '0' + timeStackSec;
    }
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
  lengthMStackM: computed('lengthM', 'lengthMStackMRaw', {
    /**
     * returns lengthMStackM, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('lengthMStackMRaw');
    },

    /**
     * sets a new lengthMStackM
     *
     * @param  {string} propertyName name of the changed property, always "lengthMStackM"
     * @param  {BigNumber|string|number} value new lengthMStackM value
     * @return {BigNumber} new lengthMStackM value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('lengthMStackMRaw');
      value = this._ensureBigNumber(value).round();
      this.set('lengthM', this.get('lengthM').plus(value.minus(previousValue)));
      return this.get('lengthMStackMRaw');
    }
  }),

  /**
   * calculates the value of lengthMStackM
   *
   * @return {BigNumber}
   */
  lengthMStackMRaw: computed('lengthM', function() {
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get('lengthM')
      .round(this.get('digits'))
      .floor();
  }),

  /**
   * lengthMStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the meters value
   */
  lengthMStackDecimal: computed('lengthM', 'lengthMStackMRaw', {
    /**
     * returns lengthMStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthMStackDecimal = this.get('lengthM')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthMStackDecimal ? lengthMStackDecimal : '0';
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
      var decimalPrecision = 100 / Math.pow(10, valueLength - 1);

      // calulate the meters from decimal place
      var decimalMeters = value
        .times(decimalPrecision)
        .dividedBy(Math.pow(10, leadingZeros))
        .dividedBy(1000);

      this.set('lengthM', this.get('lengthMStackMRaw').plus(decimalMeters));

      var lengthMStackDecimal = this.get('lengthM')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthMStackDecimal ? lengthMStackDecimal : '0';
    }
  }),

  /**
   * lengthMStackDecimalFixed is a variation of lengthMStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthMStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthMStackDecimalFixed: computed('lengthMStackDecimalFixedRaw', 'lengthM', {
    /**
     * returns lengthMStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('lengthMStackDecimalFixedRaw');
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
      if (
        valueBigNumber.round().toString().length > this.digits ||
        valueBigNumber.isNegative() === true
      ) {
        this.set(
          'lengthM',
          this.get('lengthMStackM').plus(valueBigNumber.dividedBy(100))
        );
      } else {
        this.set('lengthMStackDecimal', value);
      }
      return this.get('lengthMStackDecimalFixedRaw');
    }
  }),

  /**
   * calculates the value of lengthMStackDecimalFixed
   *
   * @return {string}
   */
  lengthMStackDecimalFixedRaw: computed(
    'lengthMStackDecimal',
    'lengthM',
    function() {
      var lengthMStackDecimal = this.get('lengthMStackDecimal');
      var zerosToAdd = this.get('digits').minus(lengthMStackDecimal.length);
      while (zerosToAdd--) {
        lengthMStackDecimal += '0';
      }
      return lengthMStackDecimal;
    }
  ),

  /**
   * length of the run in km
   */
  lengthKm: computed('lengthKmRaw', {
    /**
     * returns lengthKm, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('lengthKmRaw').round(20);
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
      this.set('lengthM', value.times(1000));
      return this.get('lengthKmRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of lengthKm, used for lossless calculation
   *
   * @return {BigNumber}
   */
  lengthKmRaw: computed('lengthM', function() {
    return this.get('lengthM').dividedBy(1000);
  }),

  /**
   * lengthKmStackKm is used to display the length like 12,34 and represents the kilometers value
   */
  lengthKmStackKm: computed('lengthM', 'lengthKmStackKmRaw', {
    /**
     * returns lengthKmStackKm, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('lengthKmStackKmRaw');
    },

    /**
     * sets a new lengthKmStackKm
     *
     * @param  {string} propertyName name of the changed property, always "lengthKmStackKm"
     * @param  {BigNumber|string|number} value new lengthKmStackKm value
     * @return {BigNumber} new lengthKmStackKm value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('lengthKmStackKmRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'lengthM',
        this.get('lengthM').plus(value.minus(previousValue).times(1000))
      );
      return this.get('lengthKmStackKmRaw');
    }
  }),

  /**
   * calculates the value of lengthKmStackKm
   *
   * @return {BigNumber}
   */
  lengthKmStackKmRaw: computed('lengthKm', function() {
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get('lengthKm')
      .round(this.get('digits'))
      .floor();
  }),

  /**
   * lengthKmStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  lengthKmStackDecimal: computed('lengthKm', 'lengthKmStackKmRaw', {
    /**
     * returns lengthKmStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthKmStackDecimal = this.get('lengthKm')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal : '0';
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
      var decimalPrecision = 100 / Math.pow(10, valueLength - 1);

      // calulate the meters from decimal place
      var decimalMeters = value
        .times(decimalPrecision)
        .dividedBy(Math.pow(10, leadingZeros));

      this.set(
        'lengthM',
        this.get('lengthKmStackKmRaw')
          .times(1000)
          .plus(decimalMeters)
      );

      var lengthKmStackDecimal = this.get('lengthKmRaw')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal : '0';
    }
  }),

  /**
   * lengthKmStackDecimalFixed is a variation of lengthKmStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthKmStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthKmStackDecimalFixed: computed('lengthKmStackDecimalFixedRaw', {
    /**
     * returns lengthKmStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('lengthKmStackDecimalFixedRaw');
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
      if (
        valueBigNumber.round().toString().length > this.digits ||
        valueBigNumber.isNegative() === true
      ) {
        this.set(
          'lengthM',
          this.get('lengthKmStackKm')
            .times(1000)
            .plus(valueBigNumber.times(10))
        );
      } else {
        this.set('lengthKmStackDecimal', value);
      }
      return this.get('lengthKmStackDecimalFixedRaw');
    }
  }),

  /**
   * calculates the value of lengthKmStackDecimalFixed
   *
   * @return {string}
   */
  lengthKmStackDecimalFixedRaw: computed(
    'lengthKmStackDecimal',
    'lengthKmRaw',
    function() {
      var lengthKmStackDecimal = this.get('lengthKmStackDecimal');
      var zerosToAdd = this.get('digits').minus(lengthKmStackDecimal.length);
      while (zerosToAdd--) {
        lengthKmStackDecimal += '0';
      }
      return lengthKmStackDecimal;
    }
  ),

  /**
   * length of the run in miles
   */
  lengthMi: computed('lengthMiRaw', {
    /**
     * returns lengthMi, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('lengthMiRaw').round(20);
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
      this.set('lengthM', value.times(this.miToM));
      return this.get('lengthMiRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of lengthMi, used for lossless calculation
   *
   * @return {BigNumber}
   */
  lengthMiRaw: computed('lengthM', function() {
    return this.get('lengthM').dividedBy(this.miToM);
  }),

  /**
   * lengthMiStackMi is used to display the length like 12,34 and represents the miles value
   */
  lengthMiStackMi: computed('lengthM', 'lengthMiStackMiRaw', {
    /**
     * returns lengthMiStackMi, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('lengthMiStackMiRaw');
    },

    /**
     * sets a new lengthMiStackMi
     *
     * @param  {string} propertyName name of the changed property, always "lengthMiStackMi"
     * @param  {BigNumber|string|number} value new lengthMiStackMi value
     * @return {BigNumber} new lengthMiStackMi value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('lengthMiStackMiRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'lengthM',
        this.get('lengthM').plus(value.minus(previousValue).times(this.miToM))
      );
      return this.get('lengthMiStackMiRaw');
    }
  }),

  /**
   * calculates the value of lengthMiStackMi
   *
   * @return {BigNumber}
   */
  lengthMiStackMiRaw: computed('lengthMiRaw', function() {
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get('lengthMi')
      .round(this.get('digits'))
      .floor();
  }),

  /**
   * lengthMiStackDecimal is used to display the length like 12,34
   * and represents up to two decimal places of the miles value
   */
  lengthMiStackDecimal: computed('lengthMi', 'lengthMiStackMiRaw', {
    /**
     * returns lengthMiStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var lengthMiStackDecimal = this.get('lengthMi')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal : '0';
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
      var decimalPrecision = 100 / Math.pow(10, valueLength - 1);

      // calulate the Meters from decimal place
      var decimalMiles = value
        .times(decimalPrecision)
        .dividedBy(Math.pow(10, leadingZeros));
      var decimalMeters = decimalMiles.dividedBy(1000).times(this.miToM);

      this.set(
        'lengthM',
        this.get('lengthMiStackMiRaw')
          .times(this.miToM)
          .plus(decimalMeters)
      );

      var lengthMiStackDecimal = this.get('lengthMiRaw')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal : '0';
    }
  }),

  /**
   * lengthMiStackDecimalFixed is a variation of lengthMiStackDecimal with a fixed
   * length as defined in the digits property. It's basically lengthMiStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  lengthMiStackDecimalFixed: computed('lengthMiStackDecimalFixedRaw', {
    /**
     * returns lengthMiStackDecimalFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('lengthMiStackDecimalFixedRaw');
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
      if (
        valueBigNumber.round().toString().length > this.digits ||
        valueBigNumber.isNegative() === true
      ) {
        this.set(
          'lengthMi',
          this.get('lengthMiStackMi').plus(valueBigNumber.dividedBy(100))
        );
      } else {
        this.set('lengthMiStackDecimal', value);
      }
      return this.get('lengthMiStackDecimalFixedRaw');
    }
  }),

  /**
   * calculates the value of lengthMiStackDecimalFixed
   *
   * @return {string}
   */
  lengthMiStackDecimalFixedRaw: computed(
    'lengthMiStackDecimal',
    'lengthKmRaw',
    function() {
      var lengthMiStackDecimal = this.get('lengthMiStackDecimal');
      var zerosToAdd = this.get('digits').minus(lengthMiStackDecimal.length);
      while (zerosToAdd--) {
        lengthMiStackDecimal += '0';
      }
      return lengthMiStackDecimal;
    }
  ),

  /**
   * pace of the run in min/km
   */
  paceMinPerKm: computed('paceMinPerKmRaw', 'lengthKmRaw', {
    /**
     * returns paceMinPerKm, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('paceMinPerKmRaw').round(20);
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
      this.set('timeSec', value.times(this.get('lengthKmRaw').times(60)));

      return this.get('paceMinPerKmRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerKm, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerKmRaw: computed('timeMinRaw', 'lengthKmRaw', function() {
    var paceMinPerKmRaw = this.get('timeMinRaw').dividedBy(
      this.get('lengthKmRaw')
    );
    return paceMinPerKmRaw.isFinite() ? paceMinPerKmRaw : new BigNumber(0);
  }),

  /**
   * paceMinPerKmStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerKmStackMin: computed('paceMinPerKmStackMinRaw', 'paceMinPerKmRaw', {
    /**
     * returns paceMinPerKmStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('paceMinPerKmStackMinRaw');
    },

    /**
     * sets a new paceMinPerKmStackMin
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackMin"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackMin value
     * @return {BigNumber} new paceMinPerKmStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('paceMinPerKmStackMinRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'paceMinPerKm',
        this.get('paceMinPerKmRaw').plus(value.minus(previousValue))
      );

      return this.get('paceMinPerKmStackMinRaw');
    }
  }),

  /**
   * calculates the value of paceMinPerKmStackMin
   *
   * @return {BigNumber}
   */
  paceMinPerKmStackMinRaw: computed('paceMinPerKmRaw', function() {
    let seconds = this.get('paceMinPerKmRaw')
      .minus(this.get('paceMinPerKmRaw').floor())
      .times(60);

    let paceMinPerKmRaw = this.get('paceMinPerKmRaw');
    // Makes sure that 5 Minutes and 59.6 Seconds will translate to 6:00
    return seconds.round().gte(60)
      ? paceMinPerKmRaw.ceil()
      : paceMinPerKmRaw.floor();
  }),

  /**
   * paceMinPerKmStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerKmStackSec: computed('paceMinPerKmStackSecRaw', 'paceMinPerKmRaw', {
    /**
     * returns paceMinPerKmStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var paceMinPerKmStackSec = this.get('paceMinPerKmStackSecRaw').round();
      return paceMinPerKmStackSec.equals(60)
        ? new BigNumber(0)
        : paceMinPerKmStackSec;
    },

    /**
     * sets a new paceMinPerKmStackSec
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackSec"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackSec value
     * @return {BigNumber} new paceMinPerKmStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('paceMinPerKmStackSecRaw');

      value = this._ensureBigNumber(value).round();
      this.set(
        'paceMinPerKm',
        this.get('paceMinPerKmRaw').plus(
          value.minus(previousValue).dividedBy(60)
        )
      );

      var paceMinPerKmStackSec = this.get('paceMinPerKmStackSecRaw').round();
      return paceMinPerKmStackSec.equals(60)
        ? new BigNumber(0)
        : paceMinPerKmStackSec;
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerKmStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerKmStackSecRaw: computed('paceMinPerKmRaw', function() {
    return this.get('paceMinPerKmRaw')
      .minus(this.get('paceMinPerKmRaw').floor())
      .times(60);
  }),

  /**
   * paceMinPerKmStackSecFixed is a variation of paceMinPerKmStackSec with a fixed length as
   * defined in the digits property to make it possible to display 12:4 as 12:04
   */
  paceMinPerKmStackSecFixed: computed('paceMinPerKmStackSecFixedRaw', {
    /**
     * returns paceMinPerKmStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('paceMinPerKmStackSecFixedRaw');
    },

    /**
     * sets a new paceMinPerKmStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerKmStackSecFixed"
     * @param  {BigNumber|string|number} value new paceMinPerKmStackSecFixed value
     * @return {string} new paceMinPerKmStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set('paceMinPerKmStackSec', value);
      return this.get('paceMinPerKmStackSecFixedRaw');
    }
  }),

  /**
   * calculates the value of paceMinPerKmStackSec
   *
   * @return {string}
   */
  paceMinPerKmStackSecFixedRaw: computed('paceMinPerKmStackSec', function() {
    var paceMinPerKmStackSec = this.get('paceMinPerKmStackSec').toString();
    var zerosToAdd = this.get('digits').minus(paceMinPerKmStackSec.length);
    while (zerosToAdd--) {
      paceMinPerKmStackSec = '0' + paceMinPerKmStackSec;
    }
    return paceMinPerKmStackSec;
  }),

  /**
   * pace of the run in min/mi
   */
  paceMinPerMi: computed('paceMinPerMiRaw', 'lengthMiRaw', {
    /**
     * returns paceMinPerMi, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('paceMinPerMiRaw').round(20);
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
      this.set('timeSec', value.times(this.get('lengthMiRaw').times(60)));

      return this.get('paceMinPerMiRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerMi, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerMiRaw: computed('timeMinRaw', 'lengthMiRaw', function() {
    var paceMinPerMiRaw = this.get('timeMinRaw').dividedBy(
      this.get('lengthMiRaw')
    );
    return paceMinPerMiRaw.isFinite() ? paceMinPerMiRaw : new BigNumber(0);
  }),

  /**
   * paceMinPerMiStackMin is used to display the pace like 12:34 and represents the minutes value
   */
  paceMinPerMiStackMin: computed('paceMinPerMiStackMinRaw', 'paceMinPerMiRaw', {
    /**
     * returns paceMinPerMiStackMin, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('paceMinPerMiStackMinRaw');
    },

    /**
     * sets a new paceMinPerMiStackMin
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackMin"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackMin value
     * @return {BigNumber} new paceMinPerMiStackMin value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('paceMinPerMiStackMinRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'paceMinPerMi',
        this.get('paceMinPerMiRaw').plus(value.minus(previousValue))
      );

      return this.get('paceMinPerMiStackMinRaw');
    }
  }),

  /**
   * calculates the value of paceMinPerMiStackMin
   *
   * @return {BigNumber}
   */
  paceMinPerMiStackMinRaw: computed('paceMinPerMiRaw', function() {
    let seconds = this.get('paceMinPerMiRaw')
      .minus(this.get('paceMinPerMiRaw').floor())
      .times(60);

    let paceMinPerMiRaw = this.get('paceMinPerMiRaw');
    // Makes sure that 5 Minutes and 59.6 Seconds will translate to 6:00
    return seconds.round().gte(60)
      ? paceMinPerMiRaw.ceil()
      : paceMinPerMiRaw.floor();
  }),

  /**
   * paceMinPerMiStackSec is used to display the pace like 12:34 and represents the seconds value
   */
  paceMinPerMiStackSec: computed('paceMinPerMiStackSecRaw', 'paceMinPerMiRaw', {
    /**
     * returns paceMinPerMiStackSec, between 0 and 59, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      var paceMinPerMiStackSec = this.get('paceMinPerMiStackSecRaw').round();
      return paceMinPerMiStackSec.equals(60)
        ? new BigNumber(0)
        : paceMinPerMiStackSec;
    },

    /**
     * sets a new paceMinPerMiStackSec
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackSec"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackSec value
     * @return {BigNumber} new paceMinPerMiStackSec value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('paceMinPerMiStackSecRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'paceMinPerMi',
        this.get('paceMinPerMiRaw').plus(
          value.minus(previousValue).dividedBy(60)
        )
      );

      var paceMinPerMiStackSec = this.get('paceMinPerMiStackSecRaw').round();
      return paceMinPerMiStackSec.equals(60)
        ? new BigNumber(0)
        : paceMinPerMiStackSec;
    }
  }),

  /**
   * calculates the uncompressed value of paceMinPerMiStackSec, used for lossless calculation
   *
   * @return {BigNumber}
   */
  paceMinPerMiStackSecRaw: computed('paceMinPerMiRaw', function() {
    return this.get('paceMinPerMiRaw')
      .minus(this.get('paceMinPerMiRaw').floor())
      .times(60);
  }),

  /**
   * paceMinPerMiStackSecFixed is a variation of paceMinPerMiStackSec with a fixed length as
   * defined in the digits property to make it possible to display 12:4 as 12:04
   */
  paceMinPerMiStackSecFixed: computed('paceMinPerMiStackSecFixedRaw', {
    /**
     * returns paceMinPerMiStackSecFixed, no decimal places
     *
     * @return {string}
     */
    get: function() {
      return this.get('paceMinPerMiStackSecFixedRaw');
    },

    /**
     * sets a new paceMinPerMiStackSecFixed
     *
     * @param  {string} propertyName name of the changed property, always "paceMinPerMiStackSecFixed"
     * @param  {BigNumber|string|number} value new paceMinPerMiStackSecFixed value
     * @return {string} new paceMinPerMiStackSecFixed value
     */
    set: function(propertyName, value) {
      this.set('paceMinPerMiStackSec', value);
      return this.get('paceMinPerMiStackSecFixedRaw');
    }
  }),

  /**
   * calculates the value of paceMinPerMiStackSec
   *
   * @return {string}
   */
  paceMinPerMiStackSecFixedRaw: computed('paceMinPerMiStackSec', function() {
    var paceMinPerMiStackSec = this.get('paceMinPerMiStackSec').toString();
    var zerosToAdd = this.get('digits').minus(paceMinPerMiStackSec.length);
    while (zerosToAdd--) {
      paceMinPerMiStackSec = '0' + paceMinPerMiStackSec;
    }
    return paceMinPerMiStackSec;
  }),

  /**
   * speed of the run in km/h
   */
  speedKmHr: computed('speedKmHrRaw', 'lengthM', {
    /**
     * returns speedKmHr, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('speedKmHrRaw').round(20);
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
      this.set(
        'timeSec',
        this.get('lengthM')
          .dividedBy(value)
          .times(3.6)
      );

      return this.get('speedKmHrRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of speedKmHrRaw, used for lossless calculation
   *
   * @return {BigNumber}
   */
  speedKmHrRaw: computed('lengthKmRaw', 'timeHrRaw', function() {
    var speedKmHrRaw = this.get('lengthKmRaw').dividedBy(this.get('timeHrRaw'));
    return speedKmHrRaw.isFinite() ? speedKmHrRaw : new BigNumber(0);
  }),

  /**
   * speedKmHrStackKm is used to display the speed like 12,34 and represents the kilometers value
   */
  speedKmHrStackKm: computed('speedKmHrStackKmRaw', 'speedKmHrRaw', {
    /**
     * returns speedKmHrStackKm, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('speedKmHrStackKmRaw');
    },

    /**
     * sets a new speedKmHrStackKm
     *
     * @param  {string} propertyName name of the changed property, always "speedKmHrStackKm"
     * @param  {BigNumber|string|number} value new speedKmHrStackKm value
     * @return {BigNumber} new speedKmHrStackKm value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('speedKmHrStackKmRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'speedKmHr',
        this.get('speedKmHrRaw').plus(value.minus(previousValue))
      );

      return this.get('speedKmHrStackKmRaw');
    }
  }),

  /**
   * calculates the value of speedKmHrStackKmRaw
   *
   * @return {BigNumber}
   */
  speedKmHrStackKmRaw: computed('speedKmHrRaw', function() {
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get('speedKmHr')
      .round(this.get('digits'))
      .floor();
  }),

  /**
   * speedKmHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the kilometers value
   */
  speedKmHrStackDecimal: computed(
    'speedKmHr',
    'speedKmHrStackKmRaw',
    'speedKmHrRaw',
    {
      /**
       * returns speedKmHrStackDecimal, no decimal places
       *
       * @return {string}
       */
      get: function() {
        var speedKmHrStackDecimal = this.get('speedKmHr')
          .round(this.get('digits'))
          .toString()
          .split('.')[1];
        return speedKmHrStackDecimal ? speedKmHrStackDecimal : '0';
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
        var decimalPrecision = 100 / Math.pow(10, valueLength - 1);

        // calulate the speed from decimal place
        var decimalSpeed = value
          .times(decimalPrecision)
          .dividedBy(Math.pow(10, leadingZeros));

        this.set(
          'speedKmHr',
          this.get('speedKmHrStackKmRaw').plus(decimalSpeed.dividedBy(1000))
        );

        var speedKmHrStackDecimal = this.get('speedKmHrRaw')
          .round(this.get('digits'))
          .toString()
          .split('.')[1];
        return speedKmHrStackDecimal ? speedKmHrStackDecimal : '0';
      }
    }
  ),

  /**
   * speedKmHrStackDecimalFixed is a variation of speedKmHrStackDecimal with a fixed
   * length as defined in the digits property. It's basically speedKmHrStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  speedKmHrStackDecimalFixed: computed(
    'speedKmHrStackDecimalFixedRaw',
    'speedKmHr',
    {
      /**
       * returns speedKmHrStackDecimalFixedRaw, no decimal places
       *
       * @return {string}
       */
      get: function() {
        return this.get('speedKmHrStackDecimalFixedRaw');
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
        if (
          valueBigNumber.round().toString().length > this.digits ||
          valueBigNumber.isNegative() === true
        ) {
          this.set(
            'speedKmHr',
            this.get('speedKmHrStackKm').plus(valueBigNumber.dividedBy(100))
          );
        } else {
          this.set('speedKmHrStackDecimal', value);
        }
        return this.get('speedKmHrStackDecimalFixedRaw');
      }
    }
  ),

  /**
   * calculates the value of speedKmHrStackDecimalFixed
   *
   * @return {string}
   */
  speedKmHrStackDecimalFixedRaw: computed(
    'speedKmHrStackDecimal',
    'speedKmHr',
    function() {
      var speedKmHrStackDecimal = this.get('speedKmHrStackDecimal');
      var zerosToAdd = this.get('digits').minus(speedKmHrStackDecimal.length);
      while (zerosToAdd--) {
        speedKmHrStackDecimal += '0';
      }
      return speedKmHrStackDecimal;
    }
  ),

  /**
   * speed of the run in mi/h
   */
  speedMiHr: computed('speedMiHrRaw', 'lengthMiRaw', {
    /**
     * returns speedMiHr, rounded to 20 digits
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('speedMiHrRaw').round(20);
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
      this.set('timeHr', this.get('lengthMiRaw').dividedBy(value));

      return this.get('speedMiHrRaw').round(20);
    }
  }),

  /**
   * calculates the uncompressed value of speedMiHr, used for lossless calculation
   *
   * @return {BigNumber}
   */
  speedMiHrRaw: computed('lengthMiRaw', 'timeHrRaw', function() {
    var speedMiHrRaw = this.get('lengthMiRaw').dividedBy(this.get('timeHrRaw'));
    return speedMiHrRaw.isFinite() ? speedMiHrRaw : new BigNumber(0);
  }),

  /**
   * speedMiHrStackMi is used to display the speed like 12,34 and represents the miles value
   */
  speedMiHrStackMi: computed('speedMiHrStackMiRaw', 'speedMiHrRaw', {
    /**
     * returns speedMiHrStackMi, no decimal places
     *
     * @return {BigNumber}
     */
    get: function() {
      return this.get('speedMiHrStackMiRaw');
    },

    /**
     * sets a new speedMiHrStackMi
     *
     * @param  {string} propertyName name of the changed property, always "speedMiHrStackMi"
     * @param  {BigNumber|string|number} value new speedMiHrStackMi value
     * @return {BigNumber} new speedMiHrStackMi value
     */
    set: function(propertyName, value) {
      var previousValue = this.get('speedMiHrStackMiRaw');
      value = this._ensureBigNumber(value).round();
      this.set(
        'speedMiHr',
        this.get('speedMiHrRaw').plus(value.minus(previousValue))
      );

      return this.get('speedMiHrStackMiRaw');
    }
  }),

  /**
   * calculates the value of speedMiHrStackMi
   *
   * @return {BigNumber}
   */
  speedMiHrStackMiRaw: computed('speedMiHrRaw', function() {
    // use a combinatin of round and floor because 4.9996 should result in 5 and 4.6 should stay 4
    return this.get('speedMiHr')
      .round(this.get('digits'))
      .floor();
  }),

  /**
   * speedMiHrStackDecimal is used to display the speed like 12,34
   * and represents up to two decimal places of the miles value
   *
   */
  speedMiHrStackDecimal: computed('speedMiHr', 'speedMiHrStackMiRaw', {
    /**
     * returns speedMiHrStackDecimal, no decimal places
     *
     * @return {string}
     */
    get: function() {
      var speedMiHrStackDecimal = this.get('speedMiHr')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal : '0';
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
      var decimalPrecision = 100 / Math.pow(10, valueLength - 1);

      // calulate the speed from decimal place
      var decimalSpeed = value
        .times(decimalPrecision)
        .dividedBy(Math.pow(10, leadingZeros));

      this.set(
        'speedMiHr',
        this.get('speedMiHrStackMiRaw').plus(decimalSpeed.dividedBy(1000))
      );

      var speedMiHrStackDecimal = this.get('speedMiHrRaw')
        .round(this.get('digits'))
        .toString()
        .split('.')[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal : '0';
    }
  }),

  /**
   * speedMiHrStackDecimalFixed is a variation of speedMiHrStackDecimal with a fixed
   * length as defined in the digits property. It's basically speedMiHrStackDecimal
   * with trailing zero(s) to make it possible to display 12,3 as 12,30
   */
  speedMiHrStackDecimalFixed: computed(
    'speedMiHrStackDecimalFixedRaw',
    'speedMiHr',
    {
      /**
       * returns speedMiHrStackDecimalFixedRaw, no decimal places
       *
       * @return {string}
       */
      get: function() {
        return this.get('speedMiHrStackDecimalFixedRaw');
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
        if (
          valueBigNumber.round().toString().length > this.digits ||
          valueBigNumber.isNegative() === true
        ) {
          this.set(
            'speedMiHr',
            this.get('speedMiHrStackMi').plus(valueBigNumber.dividedBy(100))
          );
        } else {
          this.set('speedMiHrStackDecimal', value);
        }
        return this.get('speedMiHrStackDecimalFixedRaw');
      }
    }
  ),

  /**
   * calculates the value of speedMiHrStackDecimalFixed
   *
   * @return {string}
   */
  speedMiHrStackDecimalFixedRaw: computed(
    'speedMiHrStackDecimal',
    'speedMiHr',
    function() {
      var speedMiHrStackDecimal = this.get('speedMiHrStackDecimal');
      var zerosToAdd = this.get('digits').minus(speedMiHrStackDecimal.length);
      while (zerosToAdd--) {
        speedMiHrStackDecimal += '0';
      }
      return speedMiHrStackDecimal;
    }
  ),

  /**
   * splits represents the splits of the current run
   */
  splits: DS.belongsTo('splits'),

  /**
   * update updatedAt before saving the run
   */
  save: function() {
    this.set('updatedAt', new Date());
    this._super(...arguments);
  },

  /**
   * check if the run is in a given distance range
   *
   * @param  {BigNumber|string|number} start start of the range in meter
   * @param  {BigNumber|string|number} end end of the range in meter
   * @return {boolean}
   */
  isInRange: function(startM, endM) {
    if (
      this.get('lengthM').greaterThan(startM) &&
      this.get('lengthM').lessThan(endM)
    ) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * returns the number of leading zeros from a string
   *
   * @param  {string} string string that should be analyzed for leading zeros
   * @return {number} number of leading zeros
   */
  _getLeadingZerosFromString: function(string) {
    var leadingZeros = 0;
    while (string[0] === '0') {
      string = string.substring(1);
      leadingZeros++;
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
  _ensureBigNumber: function(input) {
    return input instanceof BigNumber ? input : new BigNumber(+input || 0);
  },

  /**
   * observer to prevent the length to be negative
   */
  preventNegativeLengthM: observer('lengthM', function() {
    if (this._ensureBigNumber(this.get('lengthM')).isNegative() === true) {
      this.set('lengthM', new BigNumber(0));
    }
  }),

  /**
   * observer to prevent the time to be negative
   */
  preventNegativeTimeSec: observer('timeSec', function() {
    if (this._ensureBigNumber(this.get('timeSec')).isNegative() === true) {
      this.set('timeSec', new BigNumber(0));
    }
  })
});
