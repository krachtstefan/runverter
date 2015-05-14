import DS from 'ember-data';
export default DS.Model.extend({

	/**
	 * timeSec represents the time of a run, should be set on create
	 * 
	 * @type {number}
	 */
	timeSec : null,
	
	/**
	 * time of the run in minutes
	 * @return {string} [minutes with 4 digits precision]
	 */
	timeMin : function(){
		return (this.get('timeSec')/60).toFixed(4);
	}.property('timeSec'),

	/**
	 * time of the run in hours
	 * @return {string} hours with 4 digits precision
	 */
	timeHr : function(){
		return (this.get('timeSec')/60/60).toFixed(4);
	}.property('timeSec'),

	/**
	 * timeStackSec is used to create a view like 12:34:56
	 * @return {number} second stack of the run time
	 */
	timeStackSec : function(){
		return this.get("timeSec")-(parseInt(this.get("timeMin"))*60);
	}.property('timeSec', 'timeMin'),

	/**
	 * timeStackMin is used to create a view like 12:34:56
	 * @return {number} minutes stack of the run time
	 */
	timeStackMin : function(){
		return parseInt(this.get("timeMin"))-(this.get("timeStackHr")*60);
	}.property('timeMin', 'timeStackHr'),

	/**
	 * timeStackHr is used to create a view like 12:34:56
	 * @return {number} hours stack of the run time
	 */
	timeStackHr : function(){
		return parseInt(this.get("timeHr"));
	}.property('timeHr'),


	/**
	 * lenghtM represents the length of a run in meter, should be set on create
	 * 
	 * @type {number}
	 */
	lenghtM : null,

	/**
	 * lenght of the run in miles
	 * 
	 * @return {string} miles with 4 digits precision
	 */
	lengthMi : function(){
		return (this.get('lenghtM')*0.000621371).toFixed(4);
	}.property('lenghtM'),

	/**
	 * lengthMiStackMi is used to create a view like 12,34
	 * 
	 * @return {number} miles stack of the run
	 */
	lengthMiStackMi : function(){
		return parseInt(this.get("lengthMi"));
	}.property('lengthMi'),

	/**
	 * lengthMiStackM is used to create a view like 12,34
	 * 
	 * @return {number} decimal place of the run in miles
	 */
	lengthMiStackM : function(){
		var decimalPlace = this.get("lengthMi")-this.get("lengthMiStackMi");
		return Math.round(decimalPlace*100);
	}.property('lengthMi'),

	/**
	 * lenght of the run in km
	 * 
	 * @return {string} km with 4 digits precision
	 */
	lengthKm : function() {
		return (this.get('lenghtM')/1000).toFixed(4);
	}.property('lenghtM'),

	/**
	 * lengthKmStackKm is used to create a view like 12,34
	 * 
	 * @return {number} km stack of the run
	 */
	lengthKmStackKm : function(propertyName, value, previousValue) {
    if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("lenghtM", this.get('lenghtM')+(value-previousValue)*1000);
		}
		return parseInt(this.get("lengthKm"));
	}.property('lengthKm'),

	/**
	 * lengthKmStackDecimal is used to create a view like 12,34
	 * if arguments are passed, they are used a setter for this computed property 
	 * 
	 * @param  {string} propertyName if defined, it will be lengthKmStackDecimal
	 * @param  {string} value        new value of lengthKmStackDecimal
	 * @return {number}              decimal place of the run in km
	 */
	lengthKmStackDecimal :  function(propertyName, value) {
   	if (arguments.length > 1) {
   		var leadingZeros = this._getLeadingZerosFromString(value);	
			
    	value = +value || 0; // convert to number or set to 0
    	var valueLenght = value.toString().length; 			

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	var decimalPrecision = 100/Math.pow(10, valueLenght-1); 
    	
    	// calulate the meters from decimal place 
			var decimalMeters = (value*decimalPrecision)/Math.pow(10, leadingZeros);
			this.set("lenghtM", this.get('lengthKmStackKm')*1000+decimalMeters);
		}
		var kmDecimalPlace = parseInt(this._removeEndingZeros(this.get("lengthKm").toString().split(".")[1]));
		return kmDecimalPlace ? kmDecimalPlace : 0;
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


	
	speedKmHr : function(){
		return this.get('lengthKm')/this.get('timeHr');
	}.property('lengthKm', 'timeHr'),

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
	}
});