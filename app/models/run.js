import DS from 'ember-data';
export default DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return (this.get('timeSec')/60).toFixed(4);
	}.property('timeSec'),

	timeHr : function(){
		return (this.get('timeSec')/60/60).toFixed(4);
	}.property('timeSec'),

	// timeStack is used to create a view like 12:34:56 and is available as timeStackSec, timeStackMin and timeStackHr
	timeStackSec : function(){
		return this.get("timeSec")-(parseInt(this.get("timeMin"))*60);
	}.property('timeSec', 'timeMin'),

	timeStackMin : function(){
		return parseInt(this.get("timeMin"))-(this.get("timeStackHr")*60);
	}.property('timeMin', 'timeStackHr'),

	timeStackHr : function(){
		return parseInt(this.get("timeHr"));
	}.property('timeHr'),



	lenghtM : null,

	lengthMi : function(){
		return (this.get('lenghtM')*0.000621371).toFixed(4);
	}.property('lenghtM'),

	lengthMiStackMi : function(){
		return parseInt(this.get("lengthMi"));
	}.property('lengthMi'),

	lengthMiStackM : function(){
		var decimalPlace = this.get("lengthMi")-this.get("lengthMiStackMi");
		return Math.round(decimalPlace*100);
	}.property('lengthMi'),

	lengthKm : function() {
		return (this.get('lenghtM')/1000).toFixed(4);
	}.property('lenghtM'),

	lengthKmStackKm : function(propertyName, value, previousValue) {
    if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("lenghtM", this.get('lenghtM')+(value-previousValue)*1000);
		}
		return parseInt(this.get("lengthKm"));
	}.property('lengthKm'),

	lengthKmStackM : function(propertyName, value) {
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


	_getLeadingZerosFromString : function(string){
		var leadingZeros = 0;
   	while (string[0]==="0") {
			string = string.substring(1);
    	leadingZeros ++;
		}
		return leadingZeros;
	},

	_removeEndingZeros : function(input){
		input = input.toString();
		while (input[input.length-1]==="0") {
			input = input.slice(0,-1);
		}
		return input;
	}
});