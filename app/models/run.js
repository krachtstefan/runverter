import DS from 'ember-data';
export default DS.Model.extend({

	/**
	 * timeSec represents the time of a run, should be set on create
	 * 
	 * @type {number}	time of the run in seconds
	 */
	timeSec : null,
	
	/**
	 * time of the run in minutes
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be timeMin
	 * @param  {Object|string|number} value						new value of timeMin
	 * @return {string} 															minutes with 4 digits precision
	 */
	timeMin : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("timeSec", value*60);
		}
		return (this.get('timeSec')/60).toFixed(4);
	}.property('timeSec'),

	/**
	 * time of the run in hours
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be timeHr
	 * @param  {Object|string|number} value						new value of timeHr
	 * @return {string} 															hours with 4 digits precision
	 */
	timeHr : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("timeSec", value*60*60);
		}
		return (this.get('timeSec')/60/60).toFixed(4);
	}.property('timeSec'),

	/**
	 * timeStackSec is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property 
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackSec
	 * @param  {Object|string|number} value						new value of timeStackSec
	 * @return {number} 															second stack of the run time
	 */
	timeStackSec : function(propertyName, value) {
		if (arguments.length > 1) {
			var previousValue = this.get("timeStackSec");
			value = +Math.round(value) || 0; // convert to number or set to 0			
			this.set("timeSec", this.get('timeSec')+(value-previousValue));
		}
		return this.get("timeSec")-(parseInt(this.get("timeMin"))*60);
	}.property('timeSec', 'timeMin'),

	/**
	 * timeStackMin is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property 
	 *
	 * @param  {string}								propertyName		if defined, it will be timeStackMin
	 * @param  {Object|string|number} value						new value of timeStackMin
	 * @return {number} 															minutes stack of the run time
	 */
	timeStackMin : function(propertyName, value) {
		if (arguments.length > 1) {
			var previousValue = this.get("timeStackMin");
			value = +Math.round(value) || 0; // convert to number or set to 0			
			this.set("timeSec", this.get('timeSec')+(value-previousValue)*60);
		}
		return parseInt(this.get("timeMin"))-(this.get("timeStackHr")*60);
	}.property('timeMin', 'timeStackHr'),

	/**
	 * timeStackHr is used to create a view like 12:34:56
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be timeStackHr
	 * @param  {Object|string|number} value						new value of timeStackHr
	 * @return {number} 															hours stack of the run time
	 */
	timeStackHr : function(propertyName, value) {
		if (arguments.length > 1) {
    	var previousValue = this.get("timeStackHr");
    	value = +Math.round(value) || 0; // convert to number or set to 0
			this.set("timeSec", this.get('timeSec')+(value-previousValue)*60*60);
		}
		return parseInt(this.get("timeHr"));
	}.property('timeHr'),


	/**
	 * lengthM represents the length of a run in meter, should be set on create
	 * 
	 * @type {number} length of the run in meter
	 */
	lengthM : null,

	/**
	 * lenght of the run in miles
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be lengthMi
	 * @param  {Object|string|number} value						new value of lengthMi
	 * @return {string} 															miles with 4 digits precision
	 */
	lengthMi : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("lengthM", value*1609.344);
		}
		return (this.get('lengthM')*0.000621371).toFixed(4);
	}.property('lengthM'),

	/**
	 * lengthMiStackMi is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be lengthMiStackMi
	 * @param  {Object|string|number} value						new value of lengthMiStackMi
	 * @return {number} 															miles	stack of the run
	 */
	lengthMiStackMi : function(propertyName, value) {
    if (arguments.length > 1) {
    	var previousValue = this.get("lengthMiStackMi");
    	value = +Math.round(value) || 0; // convert to number or set to 0
			this.set("lengthM", this.get('lengthM')+(value-previousValue)*1609.344);
		}
		return parseInt(this.get("lengthMi"));
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
			
    	value = +Math.round(value) || 0; // convert to number or set to 0
    	var valueLenght = value.toString().length; 			

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLenght-1); 
    	
    	// calulate the meters from decimal place 
			var decimalMiles = (value*decimalPrecision)/Math.pow(10, leadingZeros);
    	var decimalMeters = decimalMiles/1000*1609.344;

			this.set("lengthM", this.get('lengthMiStackMi')*1609.344+decimalMeters);
		}
		var miDecimalPlace = this._removeEndingZeros(parseFloat(this.get("lengthMi")).toFixed(2).split(".")[1]);
		return miDecimalPlace ? miDecimalPlace : "0";
	}.property('lengthMi'),

	/**
	 * lenght of the run in km
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be lengthKm
	 * @param  {Object|string|number} value						new value of lengthKm
	 * @return {string}																km with 4 digits precision
	 */
	lengthKm : function(propertyName, value) {
		if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("lengthM", value*1000);
		}
		return (this.get('lengthM')/1000).toFixed(4);
	}.property('lengthM'),

	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 * if arguments are passed, they are used as a setter for this computed property 
	 * 
	 * @param  {string}								propertyName		if defined, it will be lengthKmStackKm
	 * @param  {Object|string|number} value						new value of lengthKmStackKm
	 * @return {number} 															km stack of the run
	 */
	lengthKmStackKm : function(propertyName, value) {
    if (arguments.length > 1) {
    	var previousValue = this.get("lengthKmStackKm");
    	value = +Math.round(value) || 0; // convert to number or set to 0
			this.set("lengthM", this.get('lengthM')+(value-previousValue)*1000);
		}
		return parseInt(this.get("lengthKm"));
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
   		
    	value = +Math.round(value) || 0; // convert to number or set to 0
    	var valueLenght = value.toString().length;

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLenght-1); 
    	
    	// calulate the meters from decimal place 
			var decimalMeters = (value*decimalPrecision)/Math.pow(10, leadingZeros);
			this.set("lengthM", this.get('lengthKmStackKm')*1000+decimalMeters);
		}
		var kmDecimalPlace = this._removeEndingZeros(parseFloat(this.get("lengthKm")).toFixed(2).split(".")[1]);
		return kmDecimalPlace ? kmDecimalPlace : "0";
	}.property('lengthKm'),


	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmStackMin : function(){
		return parseInt(this.get("paceMinPerKm"));
	}.property('paceMinPerKm'),

	paceMinPerKmStackSec : function(){
		var decimalPlace = this.get("paceMinPerKm")-this.get("paceMinPerKmStackMin");
		return Math.round(decimalPlace*60);
	}.property('paceMinPerKm'),
	
	paceMinPerMi  : function(){
		return this.get('timeMin')/this.get('lengthMi');
	}.property('timeSec', 'lengthMi'),

	paceMinPerMiStackMin : function(){
		return parseInt(this.get("paceMinPerMi"));
	}.property('paceMinPerMi'),

	paceMinPerMiStackSec : function(){
		var decimalPlace = this.get("paceMinPerMi")-this.get("paceMinPerMiStackMin");
		return Math.round(decimalPlace*60);
	}.property('paceMinPerMi'),


	/**
	 * speedKmHr represents the sped of the run in km per hour
	 * @return {string} km/h with 4 digits precision
	 */
	speedKmHr : function(){
		return this._toFixed((this.get('lengthM')/1000)/(this.get('timeMin')/60), 4);
	}.property('lengthM', 'timeMin'),

	speedKmHrStackKm : function(){
		return parseInt(this.get("speedKmHr"));
	}.property('speedKmHr'),

	speedKmHrStackM : function(){
		var decimalPlace = this.get("speedKmHr") - this.get("speedKmHrStackKm");
		return Math.round(decimalPlace*100);
	}.property('speedKmHr'),

	speedMiHr : function(){
		return this.get('lengthMi')/this.get('timeHr');
	}.property('lengthMi', 'timeHr'),

	speedMiHrStackKm : function(){
		return parseInt(this.get("speedMiHr"));
	}.property('speedMiHr'),

	speedMiHrStackM : function(){
		var decimalPlace = this.get("speedMiHr") - this.get("speedMiHrStackKm");
		return Math.round(decimalPlace*100);
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
		var output = input.toString();
		while (output[output.length-1]==="0") {
			output = output.slice(0,-1);
		}
		return output;
	},

	/**
	 * optimied version of the .toFixed method which has a lag of precision
	 * 2.05.toFixed(1) f.e. is 2.0 instead of 2.1
	 * 
	 * @param  {float} 	number 		input value		
	 * @param  {number} precision desired precision
	 * @return {string}       		output string with desired precision
	 */
	_toFixed : function(number, precision){
		number = parseFloat(number);
		precision = +Math.round(precision) || 0; // convert to number or set to 0
		var precisionHelpoer = Math.pow(10,precision);
		return (Math.round(number * precisionHelpoer) / precisionHelpoer).toFixed(precision);
	}
});