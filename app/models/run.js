import DS from 'ember-data';
BigNumber.config({DECIMAL_PLACES: 25});
export default DS.Model.extend({

	/**
	 * MiToM the length of a mile in meters
	 *
	 * @type {BigNumber}	length of a mile in meters
	 */
	miToM : new BigNumber(1609.344),

	/**
	 * timeSec represents the time of a run, should be set on create
	 *
	 * @type {BigNumber}	time of the run in seconds
	 */
	timeSec : new BigNumber(0),

  /**
   * Checkes if a division with miToM as the divisor ends up in a quotient with repeating digits
   *
   * @type {Boolean} is the
   */
  miToMHasRepeatingDigits : function() {
    return this._hasRepeatingDecimals(this.miToM);
  }.property('miToM'),


	/**
	 * time of the run in hours
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be timeHr
	 * @param  {Object|string|number} value						new value of timeHr
	 * @return {BigNumber} 														hours
	 */
	timeHr : function(propertyName, value) {
		if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
			this.set("timeSec", value.times(3600));
		}
		return this.get('timeSec').dividedBy(3600);
	}.property('timeSec'),

	/**
	 * time of the run in minutes
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be timeMin
	 * @param  {Object|string|number} value						new value of timeMin
	 * @return {BigNumber} 														minutes
	 */
	timeMin : function(propertyName, value) {
		if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
			this.set("timeSec", value.times(60));
		}
    return this.get('timeSec').dividedBy(60);
	}.property('timeSec'),

	/**
	 * timeStackHr is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackHr
	 * @param  {Object|string|number} value						new value of timeStackHr
	 * @return {BigNumber} 													  hours stack of the run time
	 */
	timeStackHr : function(propertyName, value) {
		if (arguments.length > 1) {
    	var previousValue = this.get("timeStackHr");
      value = this._ensureBigNumber(value).round();
			this.set("timeSec", this.get('timeSec').plus(value.minus(previousValue).times(3600)));
		}
		return this.get("timeHr").floor();
	}.property('timeHr'),

	/**
	 * timeStackMin is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackMin
	 * @param  {Object|string|number} value						new value of timeStackMin
	 * @return {BigNumber} 														minutes stack of the run time
	 */
	timeStackMin : function(propertyName, value) {
		if (arguments.length > 1) {
			var previousValue = this.get("timeStackMin");
      value = this._ensureBigNumber(value).round();
			this.set("timeSec", this.get('timeSec').plus(value.minus(previousValue).times(60)));
		}
		return this.get("timeMin").floor().minus(this.get("timeStackHr")*60);
	}.property('timeMin', 'timeStackHr'),

	/**
	 * timeStackSec is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackSec
	 * @param  {Object|string|number} value						new value of timeStackSec
	 * @return {BigNumber} 														second stack of the run time, betweeen 0 and 59
	 */
	timeStackSec : function(propertyName, value) {
		if (arguments.length > 1) {
			var previousValue = this.get("timeStackSec");
      value = this._ensureBigNumber(value).round();
			this.set("timeSec", this.get('timeSec').plus(value.minus(previousValue)));
		}
		return this.get("timeSec").minus(this.get("timeMin").floor().times(60));
	}.property('timeSec', 'timeMin'),


	/**
	 * lengthM represents the length of a run in meter, should be set on create
	 *
	 * @type {BigNumber} length of the run in meter
	 */
	lengthM : new BigNumber(0),

	/**
	 * length of the run in km
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthKm
	 * @param  {Object|string|number} value						new value of lengthKm
	 * @return {BigNumber}														km
	 */
	lengthKm : function(propertyName, value) {
		if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
			this.set("lengthM", value.times(1000));
		}
    return this.get('lengthM').dividedBy(1000);
	}.property('lengthM'),

	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthKmStackKm
	 * @param  {Object|string|number} value						new value of lengthKmStackKm
	 * @return {BigNumber} 														km stack of the run
	 */
	lengthKmStackKm : function(propertyName, value) {
    if (arguments.length > 1) {
    	var previousValue = this.get("lengthKmStackKm");
      value = this._ensureBigNumber(value).round();
			this.set("lengthM", this.get('lengthM').plus(value.minus(previousValue).times(1000)));
		}
		return this.get("lengthKm").floor();
	}.property('lengthKm'),

	/**
	 * lengthKmStackDecimal represents the decimal place of the length of the run in km
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be lengthKmStackDecimal
	 * @param  {Object|string|number} 	value        	new value of lengthKmStackDecimal
	 * @return {string}              									up to 2 digits of the decimal place of the run in km
	 */
	lengthKmStackDecimal : function(propertyName, value) {
   	if (arguments.length > 1) {
   		var leadingZeros = this._getLeadingZerosFromString(value);
      value = this._ensureBigNumber(value).round();
    	var valueLength = value.toString().length;

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLength-1);

    	// calulate the meters from decimal place
			var decimalMeters = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("lengthM", this.get('lengthKmStackKm').times(1000).plus(decimalMeters));
		}

    var lengthKmStackDecimal = this.get("lengthKm").round(2).toString().split(".")[1];
    return lengthKmStackDecimal ? lengthKmStackDecimal : "0";
	}.property('lengthKm'),

	/**
	 * length of the run in miles
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthMi
	 * @param  {Object|string|number} value						new value of lengthMi
	 * @return {BigNumber} 														miles
	 */
	lengthMi : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = this._ensureBigNumber(value);
      this.set("lengthM", value.times(this.miToM));
		}
    return this.get('lengthM').dividedBy(this.miToM);
	}.property('lengthM'),

	/**
	 * lengthMiStackMi is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be lengthMiStackMi
	 * @param  {Object|string|number} value						new value of lengthMiStackMi
	 * @return {BigNumber} 													  miles	stack of the run
	 */
	lengthMiStackMi : function(propertyName, value) {
    if (arguments.length > 1) {
    	var previousValue = this.get("lengthMiStackMi");
      value = this._ensureBigNumber(value).round();
			this.set("lengthM", this.get('lengthM').plus(value.minus(previousValue).times(this.miToM)));
		}
		return this.get("lengthMi").floor();
	}.property('lengthMi'),

	/**
	 * lengthMiStackDecimal represents the decimal place of the length of the run in miles
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be lengthMiStackDecimal
	 * @param  {Object|string|number} 	value        	new value of lengthMiStackDecimal
	 * @return {string} 															up to 4 digits of the decimal place of the run in miles
	 */
	lengthMiStackDecimal : function(propertyName, value) {
   	if (arguments.length > 1) {
   		var leadingZeros = this._getLeadingZerosFromString(value);

      value = this._ensureBigNumber(value).round();
    	var valueLength = value.toString().length;

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLength-1);

    	// calulate the Meters from decimal place
      var decimalMiles = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));
      var decimalMeters = decimalMiles.dividedBy(1000).times(this.miToM);

      this.set("lengthM", this.get('lengthMiStackMi').times(this.miToM).plus(decimalMeters));
		}

    var lengthMiStackDecimal = this.get("lengthMi").round(2).toString().split(".")[1];
		return lengthMiStackDecimal ? lengthMiStackDecimal : "0";
	}.property('lengthMi'),

	/**
	 * paceMinPerKm represents the pace of the run in min/km
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be paceMinPerKm
	 * @param  {Object|string|number} 	value        	new value of paceMinPerKm
	 * @return {BigNumber}              							min/km
	 */
	paceMinPerKm : function(propertyName, value) {
		if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
    	this.set('timeSec',value.times(this.get('lengthKm').times(60)));
		}
    return this.get('timeMin').dividedBy(this.get('lengthKm'));
	}.property('timeMin', 'lengthKm'),

	/**
	 * paceMinPerKmStackMin is used to create a view like 12:34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerKmStackMin
	 * @param  {Object|string|number} value						new value of paceMinPerKmStackMin
	 * @return {BigNumber} 														min stack of the pace
	 */
	paceMinPerKmStackMin : function(propertyName, value) {
		if (arguments.length > 1) {
    	var previousValue = this.get("paceMinPerKmStackMin");
      value = this._ensureBigNumber(value).round();
			this.set("paceMinPerKm", this.get('paceMinPerKm').plus(value.minus(previousValue)));
		}
		return this.get("paceMinPerKm").floor();
	}.property('paceMinPerKm'),

	/**
	 * paceMinPerKmStackSec is used to create a view like 12:34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerKmStackSec
	 * @param  {Object|string|number} value						new value of paceMinPerKmStackSec
	 * @return {BigNumber} 														second stack of the pace, betweeen 0 and 59
	 */
	paceMinPerKmStackSec : function(propertyName, value) {
		if (arguments.length > 1) {
      // TODO: use this.get("paceMinPerKmStackSec") again if it's not rounded
			var previousValue = this.get("paceMinPerKm").minus(this.get("paceMinPerKmStackMin")).times(60);
			value = this._ensureBigNumber(value).round();
      this.set("paceMinPerKm", this.get('paceMinPerKm').plus(value.minus(previousValue).dividedBy(60)));
		}
		return this.get("paceMinPerKm").minus(this.get("paceMinPerKmStackMin")).times(60).round();
	}.property('paceMinPerKm'),

	/**
	 * paceMinPerMi represents the pace of the run in min/mi
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be paceMinPerMi
	 * @param  {Object|string|number} 	value        	new value of paceMinPerMi
	 * @return {BigNumber}              							min/mi
	 */
	paceMinPerMi : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = this._ensureBigNumber(value);
      this.set('timeSec',value.times(this.get('lengthMi').times(60)));
		}
    return this.get('timeMin').dividedBy(this.get('lengthMi'));
	}.property('timeMin', 'lengthMi'),

	/**
	 * paceMinPerMiStackMin is used to create a view like 12:34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerMiStackMin
	 * @param  {Object|string|number} value						new value of paceMinPerMiStackMin
	 * @return {BigNumber} 													  min stack of the pace
	 */
	paceMinPerMiStackMin : function(propertyName, value) {
		if (arguments.length > 1) {
    	var previousValue = this.get("paceMinPerMiStackMin");
    	value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get('paceMinPerMi').plus(value.minus(previousValue)));
		}
		return this.get("paceMinPerMi").floor();
	}.property('paceMinPerMi'),

	/**
	 * paceMinPerMiStackSec is used to create a view like 12:34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string}								propertyName		if defined, it will be paceMinPerMiStackSec
	 * @param  {Object|string|number} value						new value of paceMinPerMiStackSec, betweeen 0 and 59
	 * @return {BigNumber} 														second stack of the pace, betweeen 0 and 59
	 */
	paceMinPerMiStackSec : function(propertyName, value) {
		if (arguments.length > 1) {
			var previousValue = this.get("paceMinPerMiStackSec");
			value = this._ensureBigNumber(value).round();
      this.set("paceMinPerMi", this.get('paceMinPerMi').plus(value.minus(previousValue).dividedBy(60)));
		}
    return this.get("paceMinPerMi").minus(this.get("paceMinPerMiStackMin")).times(60).round();
	}.property('paceMinPerMi', 'paceMinPerMiStackMin'),


	/**
	 * speedKmHr represents the speed of the run in km per hour
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHr
	 * @param  {Object|string|number} 	value        	new value of speedKmHr
	 * @return {BigNumber} 														km/hr
	 */
	speedKmHr : function(propertyName, value) {
   	if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
    	this.set('timeSec',this.get('lengthM').dividedBy(value).times(3.6));
		}

    // more unprecise initial version, final version has one less dividedBy
    // return this.get('lengthM').dividedBy(1000).dividedBy(this.get('timeSec').dividedBy(3600));

    return this.get('lengthM').dividedBy(this.get('timeSec').dividedBy(3.6));
	}.property('lengthM', 'timeSec'),

	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHrStackKm
	 * @param  {Object|string|number} 	value        	new value of speedKmHrStackKm
	 * @return {number} 															km stack of the speed
	 */
	speedKmHrStackKm : function(propertyName, value) {
		if (arguments.length > 1) {
    	var previousValue = this.get("speedKmHrStackKm");
    	value = this._ensureBigNumber(value).round();
    	this.set("speedKmHr", this.get('speedKmHr').plus(value.minus(previousValue)));
		}
		return this.get("speedKmHr").floor();
	}.property('speedKmHr'),

	/**
	 * speedKmHrStackDecimal is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedKmHrStackDecimal
	 * @param  {Object|string|number} 	value        	new value of speedKmHrStackDecimal
	 * @return {string} 															up to 2 digits of the decimal place of the speed in km/hr
	 */
	speedKmHrStackDecimal : function(propertyName, value) {
		if (arguments.length > 1) {
			var leadingZeros = this._getLeadingZerosFromString(value);

			value = this._ensureBigNumber(value).round();
			var valueLength = value.toString().length;

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLength-1);

     	// calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

      this.set("speedKmHr", this.get('speedKmHrStackKm').plus(decimalSpeed.dividedBy(1000)));
		}

    var speedKmHrStackDecimal = this.get("speedKmHr").round(2).toString().split(".")[1];
		return speedKmHrStackDecimal ? speedKmHrStackDecimal : "0";
	}.property('speedKmHr'),

	/**
	 * speedMiHr represents the speed of the run in miles per hour
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHr
	 * @param  {Object|string|number} 	value        	new value of speedMiHr
	 * @return {BigNumber}														mi/hr
	 */
	speedMiHr : function(propertyName, value) {
		if (arguments.length > 1) {
      value = this._ensureBigNumber(value);
      this.set('timeHr',this.get('lengthMi').dividedBy(value));
		}
		return this.get('lengthMi').dividedBy(this.get('timeHr'));
	}.property('lengthM', 'timeHr'),

	/**
	 * speedMiHrStackMi is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHrStackMi
	 * @param  {Object|string|number} 	value        	new value of speedMiHrStackMi
	 * @return {BigNumber} 														mi stack of the speed
	 */
	speedMiHrStackMi : function(propertyName, value) {
		if (arguments.length > 1) {
      var previousValue = this.get("speedMiHrStackMi");
      value = this._ensureBigNumber(value).round();
      this.set("speedMiHr", this.get('speedMiHr').plus(value.minus(previousValue)));
		}
		return this.get("speedMiHr").floor();
	}.property('speedMiHr'),

	/**
	 * speedMiHrStackDecimal is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property
	 *
	 * @param  {string} 								propertyName 	if defined, it will be speedMiHrStackDecimal
	 * @param  {Object|string|number} 	value        	new value of speedMiHrStackDecimal
	 * @return {number} 															up to 2 digits of the decimal place of the speed in mi/hr
	 */
	speedMiHrStackDecimal : function(propertyName, value) {
		if (arguments.length > 1) {
      var leadingZeros = this._getLeadingZerosFromString(value);

      value = this._ensureBigNumber(value).round();
			var valueLength = value.toString().length;

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLength-1);

     	// calulate the speed from decimal place
      var decimalSpeed = value.times(decimalPrecision).dividedBy(Math.pow(10, leadingZeros));

 			this.set("speedMiHr", this.get("speedMiHrStackMi").plus(decimalSpeed.dividedBy(1000)));
		}

    var speedMiHrStackDecimal = this.get("speedMiHr").round(2).toString().split(".")[1];
		return speedMiHrStackDecimal ? speedMiHrStackDecimal : "0";
	}.property('speedMiHr'),

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
	 * removes all zeros from the end of a string
	 * @param  {string} input input string
	 * @return {string}       output string
	 */
	_removeEndingZeros : function(input){
		var output = (typeof input === "undefined") ? "" : input.toString();
		while (output[output.length-1]==="0") {
			output = output.slice(0,-1);
		}
		return output;
	},

	/**
	 * optimied version of the .toFixed method which has a lag of precision
	 * 2.05.toFixed(1) f.e. is 2.0 instead of 2.1
	 * found some issues with this fix as well f.e. 2.21235 results in 2.2124
	 *
	 * @param  {float} 	number 		input value
	 * @param  {number} precision desired precision
	 * @return {string}       		output string with desired precision
	 */
	_toFixed : function(number, precision){
		number = parseFloat(number);
		precision = +Math.round(precision) || 0; // convert to number or set to 0
		var precisionHelper = Math.pow(10,precision);
		return (Math.round(number * precisionHelper) / precisionHelper).toFixed(precision);
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
  },


  /**
   * searches an input array for e specific element and returns
   * a new array with all of the found elements removed
   *
   * @param  {array}    srcArr    source array
   * @param  {any}      element   element to search for
   * @return {array}              new array
   */
  _removeElementFromArray : function(srcArr, element){
    var arr = srcArr.slice();
    while (arr.indexOf(element)>=0) {
      arr.splice(arr.indexOf(element), 1);
    }
    return arr;
  },

  /**
   * detects all prime factors of a given number and returns it as an array
   * source:
   * http://www.coderenaissance.com/2011/06/finding-prime-factors-in-javascript.html
   *
   * @param  {number}    num    source array
   * @return {array}            all prime factors
   */
  _returnPrimeFactors : function(num){
    var root = Math.sqrt(num),
    result = arguments[1] || [],  //get unnamed paremeter from recursive calls
    x = 2;

    if(num % x){//if not divisible by 2
     x = 3;//assign first odd
     while((num % x) && ((x = x + 2) < root)){}//iterate odds
    }
    //if no factor found then num is prime
    x = (x <= root) ? x : num;
    result.push(x);//push latest prime factor

    //if num isn't prime factor make recursive call
    return (x === num) ? result : this._returnPrimeFactors(num/x, result) ;
  },

  /**
   * This method detects if a fraction has repeating decimals
   * A fraction N/D has no repeating decimals when D is equal to 1 or D's prime factors only consist of 2's and/or 5's
   * http://math.stackexchange.com/questions/197478/detecting-that-a-fraction-is-a-repeating-decimal
   *
   * @param  {BigNumber}   value      denominator
   * @return {Boolean}                answer to "has repeating decimals?"
   */
  _hasRepeatingDecimals : function(denominator){
    // handle floating points by shifting the comma (turn 3.456 to 3456)
    if(denominator.decimalPlaces() > 0){
      denominator = denominator.shift(denominator.decimalPlaces());
    }
    var denominatorPrimeFactors = this._returnPrimeFactors(denominator.toNumber());
    denominatorPrimeFactors = this._removeElementFromArray(denominatorPrimeFactors, 2);
    denominatorPrimeFactors = this._removeElementFromArray(denominatorPrimeFactors, 5);
    return (denominator.equals(1) || denominatorPrimeFactors.length === 0) ? false : true;
  }
});
