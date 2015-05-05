Runverter.Run = DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return this.get('timeSec')/60;
	}.property('timeSec'),

	timeHr : function(){
		return this.get('timeSec')/60/60;
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
		return this.get('lenghtM')*0.000621371;
	}.property('lenghtM'),

	lengthMiStackMi : function(){
		return parseInt(this.get("lengthMi"));
	}.property('lengthMi'),

	lengthMiStackM : function(){
		decimalPlace = this.get("lengthMi")-this.get("lengthMiStackMi");
		return Math.round(decimalPlace*100);
	}.property('lengthMi'),

	lengthKm : function() {
		return this.get('lenghtM')/1000;
	}.property('lenghtM'),

	lengthKmStackKm : function(propertyName, value, previousValue) {
    if (arguments.length > 1) {
    	value = +value || 0; // convert to number or set to 0
			this.set("lenghtM", this.get('lenghtM')+(value-previousValue)*1000);
		}
		return parseInt(this.get("lengthKm"));
	}.property('lengthKm'),

	lengthKmStackM : function(propertyName, value, previousValue) {
   	if (arguments.length > 1) {
   		var leadingZeros = this._getLeadingZerosFromString(value);	
			
			valueLenght = value.toString().length; 			
    	value = +value || 0; // convert to number or set to 0
			

    	// reflects the decimal precision of the value
    	// 1 = 100; 10 = 10
    	decimalPrecision = 100/Math.pow(10, valueLenght-1); 
    	
    	// calulate the meters from decimal place 
			decimalMeters = (value*decimalPrecision)/Math.pow(10, leadingZeros);
			this.set("lenghtM", this.get('lengthKmStackKm')*1000+decimalMeters);
		}
		decimalPlace = this.get("lengthKm")-this.get("lengthKmStackKm");
		return Math.round(decimalPlace*100);
	}.property('lengthKm'),


	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmStackMin : function(){
		return parseInt(this.get("paceMinPerKm"));
	}.property('paceMinPerKm'),

	paceMinPerKmStackSec : function(){
		decimalPlace = this.get("paceMinPerKm")-this.get("paceMinPerKmStackMin");
		return Math.round(decimalPlace*60);
	}.property('paceMinPerKm'),
	
	paceMinPerMi  : function(){
		return this.get('timeMin')/this.get('lengthMi');
	}.property('timeSec', 'lengthMi'),

	paceMinPerMiStackMin : function(){
		return parseInt(this.get("paceMinPerMi"));
	}.property('paceMinPerMi'),

	paceMinPerMiStackSec : function(){
		decimalPlace = this.get("paceMinPerMi")-this.get("paceMinPerMiStackMin");
		return Math.round(decimalPlace*60);
	}.property('paceMinPerMi'),


	
	speedKmHr : function(){
		return this.get('lengthKm')/this.get('timeHr');
	}.property('lengthKm', 'timeHr'),

	speedKmHrStackKm : function(){
		return parseInt(this.get("speedKmHr"));
	}.property('speedKmHr'),

	speedKmHrStackM : function(){
		decimalPlace = this.get("speedKmHr") - this.get("speedKmHrStackKm");
		return Math.round(decimalPlace*100);
	}.property('speedKmHr'),

	speedMiHr : function(){
		return this.get('lengthMi')/this.get('timeHr');
	}.property('lengthMi', 'timeHr'),

	speedMiHrStackKm : function(){
		return parseInt(this.get("speedMiHr"));
	}.property('speedMiHr'),

	speedMiHrStackM : function(){
		decimalPlace = this.get("speedMiHr") - this.get("speedMiHrStackKm");
		return Math.round(decimalPlace*100);
	}.property('speedMiHr'),


	_getLeadingZerosFromString : function(string){
		var leadingZeros = 0;
   	while (string[0]=="0") {
			string = string.substring(1);
    	leadingZeros ++;
		}
		return leadingZeros;
	}
});