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
	 *
	 * @param  {string}								propertyName		if defined, it will be timeHr
	 * @param  {Object|string|number} value						new value of timeHr
	 * @return {BigNumber} 														hours
	 */
  timeHr: Ember.computed("timeHrRaw", {
    get: function() {
      return this.get("timeHrRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec", value.times(3600));
      return this.get("timeHrRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of timeHr, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	timeHrRaw : Ember.computed("timeSec", function(){
	  return this.get("timeSec").dividedBy(3600);
	}),

	/**
	 * time of the run in minutes
	 *
	 * @param  {string}								propertyName		if defined, it will be timeMin
	 * @param  {Object|string|number} value						new value of timeMin
	 * @return {BigNumber} 														minutes
	 */
  timeMin : Ember.computed("timeMinRaw", {
    get: function() {
      return this.get("timeMinRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec", value.times(60));
      return this.get("timeMinRaw").round(60);
    }
	}),

	/**
	 * uncompressed value of timeMin, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	timeMinRaw : Ember.computed("timeSec", function(){
		return this.get("timeSec").dividedBy(60);
	}),

	/**
	 * timeStackHr is used to create a view like 12:34:56
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackHr
	 * @param  {Object|string|number} value						new value of timeStackHr
	 * @return {BigNumber} 													  hours stack of the run time
	 */
	 timeStackHr : Ember.computed("timeSec", "timeStackHrRaw" ,{
	   get: function() {
	     return this.get("timeStackHrRaw");
	   },
	   set: function(propertyName, value) {
	     var previousValue = this.get("timeStackHrRaw");
	     value = this._ensureBigNumber(value).round();
	     this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue).times(3600)));
	     return this.get("timeStackHrRaw");
	   }
	 }),

	 /**
	  *  calculates the value of timeStackHr
	  *
	  * @return {BigNumber}
	  */
	 timeStackHrRaw : Ember.computed("timeHr", function(){
	   return this.get("timeHr").floor();
	 }),

	/**
	 * timeStackMin is used to create a view like 12:34:56
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackMin
	 * @param  {Object|string|number} value						new value of timeStackMin
	 * @return {BigNumber} 														minutes stack of the run time
	 */
  timeStackMin : Ember.computed("timeSec", "timeStackMinRaw",{
    get: function() {
      return this.get("timeStackMinRaw").round(20);
    },
    set: function(propertyName, value) {
      var previousValue = this.get("timeStackMinRaw");
      value = this._ensureBigNumber(value).round();
      this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue).times(60)));
      return this.get("timeStackMinRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of timeStackMin, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	timeStackMinRaw : Ember.computed("timeMinRaw", "timeStackHrRaw", function(){
		return this.get("timeMinRaw").floor().minus(this.get("timeStackHrRaw")*60);
	}),

	/**
	 * timeStackSec is used to create a view like 12:34:56
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackSec
	 * @param  {Object|string|number} value						new value of timeStackSec
	 * @return {BigNumber} 														second stack of the run time, betweeen 0 and 59
	 */
  timeStackSec : Ember.computed("timeSec", "timeStackSecRaw",{
    get: function() {
      return this.get("timeStackSecRaw").round(20);
    },
    set: function(propertyName, value) {
      var previousValue = this.get("timeStackSecRaw");
      value = this._ensureBigNumber(value).round();
      this.set("timeSec", this.get("timeSec").plus(value.minus(previousValue)));
      return this.get("timeStackSecRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of timeStackSec, used for lossless calculation
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
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthKm
	 * @param  {Object|string|number} value						new value of lengthKm
	 * @return {BigNumber}														km
	 */
  lengthKm : Ember.computed("lengthKmRaw", {
    get: function() {
      return this.get("lengthKmRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("lengthM", value.times(1000));
			return this.get("lengthKmRaw");
    }
	}),

	/**
	 * uncompressed value of lengthKm, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	lengthKmRaw : Ember.computed("lengthM", function(){
		return this.get("lengthM").dividedBy(1000);
	}),


	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthKmStackKm
	 * @param  {Object|string|number} value						new value of lengthKmStackKm
	 * @return {BigNumber} 														km stack of the run
	 */
  lengthKmStackKm : Ember.computed("lengthM", "lengthKmStackKmRaw", {
    get: function() {
      return this.get("lengthKmStackKmRaw");
    },
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
	 * lengthKmStackDecimal represents the decimal place of the length of the run in km
	 *
	 * @param  {string} 								propertyName 	if defined, it will be lengthKmStackDecimal
	 * @param  {Object|string|number} 	value        	new value of lengthKmStackDecimal
	 * @return {string}              									up to 2 digits of the decimal place of the run in km
	 */
  lengthKmStackDecimal : Ember.computed("lengthKmRaw", "lengthKmStackKmRaw", {
    get: function() {
      var lengthKmStackDecimal = this.get("lengthKmRaw").round(2).toString().split(".")[1];
      return lengthKmStackDecimal ? lengthKmStackDecimal : "0";
    },
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
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthMi
	 * @param  {Object|string|number} value						new value of lengthMi
	 * @return {BigNumber} 														miles
	 */
  lengthMi : Ember.computed("lengthMiRaw", {
    get: function() {
      return this.get("lengthMiRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("lengthM", value.times(this.miToM));
      return this.get("lengthMiRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of lengthMi, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	lengthMiRaw : Ember.computed("lengthM", function(){
		return this.get("lengthM").dividedBy(this.miToM);
	}),

	/**
	 * lengthMiStackMi is used to create a view like 12,34
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthMiStackMi
	 * @param  {Object|string|number} value						new value of lengthMiStackMi
	 * @return {BigNumber} 													  miles	stack of the run
	 */
  lengthMiStackMi : Ember.computed("lengthM", "lengthMiStackMiRaw", {
    get: function() {
      return this.get("lengthMiStackMiRaw");
    },
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
	 * lengthMiStackDecimal represents the decimal place of the length of the run in miles
	 *
	 * @param  {string} 								propertyName 	if defined, it will be lengthMiStackDecimal
	 * @param  {Object|string|number} 	value        	new value of lengthMiStackDecimal
	 * @return {string} 															up to 4 digits of the decimal place of the run in miles
	 */
  lengthMiStackDecimal : Ember.computed("lengthMiRaw", "lengthMiStackMiRaw", {
    get: function() {
      var lengthMiStackDecimal = this.get("lengthMiRaw").round(2).toString().split(".")[1];
      return lengthMiStackDecimal ? lengthMiStackDecimal : "0";
    },
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
	 * paceMinPerKm represents the pace of the run in min/km
	 *
	 * @param  {string} 								propertyName 	if defined, it will be paceMinPerKm
	 * @param  {Object|string|number} 	value        	new value of paceMinPerKm
	 * @return {BigNumber}              							min/km
	 */
  paceMinPerKm : Ember.computed("paceMinPerKmRaw", "lengthKmRaw", {
    get: function() {
      return this.get("paceMinPerKmRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",value.times(this.get("lengthKmRaw").times(60)));

      return this.get("paceMinPerKmRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of paceMinPerKm, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	paceMinPerKmRaw : Ember.computed("timeMinRaw", "lengthKmRaw", function(){
		return this.get("timeMinRaw").dividedBy(this.get("lengthKmRaw"));
	}),

	/**
	 * paceMinPerKmStackMin is used to create a view like 12:34
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerKmStackMin
	 * @param  {Object|string|number} value						new value of paceMinPerKmStackMin
	 * @return {BigNumber} 														min stack of the pace
	 */
  paceMinPerKmStackMin : Ember.computed("paceMinPerKmStackMinRaw", "paceMinPerKmRaw", {
    get: function() {
      return this.get("paceMinPerKmStackMinRaw");
    },
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
	 * paceMinPerKmStackSec is used to create a view like 12:34
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerKmStackSec
	 * @param  {Object|string|number} value						new value of paceMinPerKmStackSec
	 * @return {BigNumber} 														second stack of the pace, betweeen 0 and 59
	 */
  paceMinPerKmStackSec : Ember.computed("paceMinPerKmStackSecRaw", "paceMinPerKmRaw", {
    get: function() {
      return this.get("paceMinPerKmStackSecRaw").round();
    },
    set: function(propertyName, value) {
			var previousValue = this.get("paceMinPerKmStackSecRaw");

      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerKm", this.get("paceMinPerKmRaw").plus(value.minus(previousValue).dividedBy(60)));

      return this.get("paceMinPerKmStackSecRaw").round();
    }
	}),

	/**
	 * uncompressed value of paceMinPerKmStackSec, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	paceMinPerKmStackSecRaw : Ember.computed("paceMinPerKmRaw", "paceMinPerKmStackMinRaw", function(){
		return this.get("paceMinPerKmRaw").minus(this.get("paceMinPerKmStackMinRaw")).times(60);
	}),


	/**
	 * paceMinPerMi represents the pace of the run in min/mi
	 *
	 * @param  {string} 								propertyName 	if defined, it will be paceMinPerMi
	 * @param  {Object|string|number} 	value        	new value of paceMinPerMi
	 * @return {BigNumber}              							min/mi
	 */
  paceMinPerMi : Ember.computed("timeMin", "lengthMi", "paceMinPerMiStackSec", {
    get: function() {
      return this.get("paceMinPerMiRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",value.times(this.get("lengthMiRaw").times(60)));

			return this.get("paceMinPerMiRaw");
    }
	}),

	/**
	 * uncompressed value of paceMinPerMi, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	paceMinPerMiRaw : Ember.computed("timeSec", "lengthM", function(){
		return this.get("timeMinRaw").dividedBy(this.get("lengthMiRaw"));
	}),

	/**
	 * paceMinPerMiStackMin is used to create a view like 12:34
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerMiStackMin
	 * @param  {Object|string|number} value						new value of paceMinPerMiStackMin
	 * @return {BigNumber} 													  min stack of the pace
	 */
  paceMinPerMiStackMin : Ember.computed("paceMinPerMi", {
    get: function() {
      return this.get("paceMinPerMiStackMinRaw");
    },
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerMiStackMinRaw");
      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get("paceMinPerMiRaw").plus(value.minus(previousValue)));

      return this.get("paceMinPerMiStackMinRaw");
    }
	}),

	/**
	 * uncompressed value of paceMinPerMiStackMin, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	paceMinPerMiStackMinRaw : Ember.computed("paceMinPerMi", function(){
		return this.get("paceMinPerMiRaw").floor();
	}),


	/**
	 * paceMinPerMiStackSec is used to create a view like 12:34
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerMiStackSec
	 * @param  {Object|string|number} value						new value of paceMinPerMiStackSec, betweeen 0 and 59
	 * @return {BigNumber} 														second stack of the pace, betweeen 0 and 59
	 */
  paceMinPerMiStackSec : Ember.computed("paceMinPerMi", "paceMinPerMiStackMin", {
    get: function() {
      return this.get("paceMinPerMiStackSecRaw").round();
    },
    set: function(propertyName, value) {
      var previousValue = this.get("paceMinPerMiStackSecRaw");
      value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get("paceMinPerMiRaw").plus(value.minus(previousValue).dividedBy(60)));

      return this.get("paceMinPerMiStackSecRaw").round();
    }
	}),

	/**
	 * uncompressed value of paceMinPerMiStackSec, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	paceMinPerMiStackSecRaw : Ember.computed("paceMinPerMi", "paceMinPerMiStackMin", function(){
		return this.get("paceMinPerMiRaw").minus(this.get("paceMinPerMiStackMinRaw")).times(60);
	}),


	/**
	 * speedKmHr represents the speed of the run in km per hour
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHr
	 * @param  {Object|string|number} 	value        	new value of speedKmHr
	 * @return {BigNumber} 														km/hr
	 */
  speedKmHr : Ember.computed("lengthM", "timeSec", {
    get: function() {
      return this.get("speedKmHrRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeSec",this.get("lengthM").dividedBy(value).times(3.6));

      return this.get("speedKmHrRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of speedKmHrRaw, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	speedKmHrRaw : Ember.computed("lengthM", "timeSec", function(){
		return this.get("lengthKmRaw").dividedBy(this.get("timeHrRaw"));
	}),

	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHrStackKm
	 * @param  {Object|string|number} 	value        	new value of speedKmHrStackKm
	 * @return {number} 															km stack of the speed
	 */
  speedKmHrStackKm : Ember.computed("speedKmHr", {
    get: function() {
      return this.get("speedKmHrStackKmRaw");
    },
    set: function(propertyName, value) {
      var previousValue = this.get("speedKmHrStackKmRaw");
      value = this._ensureBigNumber(value).round();
      this.set("speedKmHr", this.get("speedKmHrRaw").plus(value.minus(previousValue)));

      return this.get("speedKmHrStackKmRaw");
    }
	}),

	/**
	 * uncompressed value of speedKmHrStackKmRaw, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	speedKmHrStackKmRaw : Ember.computed("speedKmHr", function(){
		return this.get("speedKmHrRaw").floor();
	}),

	/**
	 * speedKmHrStackDecimal is used to create a view like 12,34
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHrStackDecimal
	 * @param  {Object|string|number} 	value        	new value of speedKmHrStackDecimal
	 * @return {string} 															up to 2 digits of the decimal place of the speed in km/hr
	 */
	 speedKmHrStackDecimal : Ember.computed("speedKmHr", {
    get: function() {
      var speedKmHrStackDecimal = this.get("speedKmHrRaw").round(2).toString().split(".")[1];
      return speedKmHrStackDecimal ? speedKmHrStackDecimal : "0";
    },
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
	 * speedMiHr represents the speed of the run in miles per hour
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHr
	 * @param  {Object|string|number} 	value        	new value of speedMiHr
	 * @return {BigNumber}														mi/hr
	 */
  speedMiHr : Ember.computed("lengthM", "timeHr", {
    get: function() {
      return this.get("speedMiHrRaw").round(20);
    },
    set: function(propertyName, value) {
      value = this._ensureBigNumber(value);
      this.set("timeHr",this.get("lengthMiRaw").dividedBy(value));

			return this.get("speedMiHrRaw").round(20);
    }
	}),

	/**
	 * uncompressed value of speedMiHr, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	speedMiHrRaw : Ember.computed("lengthM", "timeHr", function(){
		return this.get("lengthMiRaw").dividedBy(this.get("timeHrRaw"));
	}),

	/**
	 * speedMiHrStackMi is used to create a view like 12,34
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHrStackMi
	 * @param  {Object|string|number} 	value        	new value of speedMiHrStackMi
	 * @return {BigNumber} 														mi stack of the speed
	 */
  speedMiHrStackMi : Ember.computed("speedMiHr", {
    get: function() {
      return this.get("speedMiHrStackMiRaw");
    },
    set: function(propertyName, value) {
      var previousValue = this.get("speedMiHrStackMiRaw");
      value = this._ensureBigNumber(value).round();
      this.set("speedMiHr", this.get("speedMiHrRaw").plus(value.minus(previousValue)));

      return this.get("speedMiHrStackMiRaw");
    }
	}),

	/**
	 * uncompressed value of speedMiHrStackMi, used for lossless calculation
	 *
	 * @return {BigNumber}
	 */
	speedMiHrStackMiRaw : Ember.computed("speedMiHr", function(){
		return this.get("speedMiHrRaw").floor();
	}),

	/**
	 * speedMiHrStackDecimal is used to create a view like 12,34
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHrStackDecimal
	 * @param  {Object|string|number} 	value        	new value of speedMiHrStackDecimal
	 * @return {string} 															up to 2 digits of the decimal place of the speed in mi/hr
	 */
  speedMiHrStackDecimal : Ember.computed("speedMiHr", {
    get: function() {
      var speedMiHrStackDecimal = this.get("speedMiHrRaw").round(2).toString().split(".")[1];
      return speedMiHrStackDecimal ? speedMiHrStackDecimal : "0";
    },
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
