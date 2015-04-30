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

	lengthMiArr : function(){
		return this.get("lengthMi").toFixed(2).split(".", 2);
	}.property('lengthMi'),

	lengthKm : function(){
		return this.get('lenghtM')*0.001;
	}.property('lenghtM'),

	lengthKmArr : function(){
		return this.get("lengthKm").toFixed(2).split(".", 2);
	}.property('lengthKm'),


	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmStackMin : function(){
		return parseInt(this.get("paceMinPerKm"));
	}.property('paceMinPerKm'),

	paceMinPerKmStackSec : function(){
		decimalPlace = this.get("paceMinPerKm")-parseInt(this.get("paceMinPerKm"));
		return Math.round(decimalPlace*60);
	}.property('paceMinPerKm'),
	
	paceMinPerMi  : function(){
		return this.get('timeMin')/this.get('lengthMi');
	}.property('timeSec', 'lengthMi'),

	paceMinPerMiStackMin : function(){
		return parseInt(this.get("paceMinPerMi"));
	}.property('paceMinPerMi'),

	paceMinPerMiStackSec : function(){
		decimalPlace = this.get("paceMinPerMi")-parseInt(this.get("paceMinPerMi"));
		return Math.round(decimalPlace*60);
	}.property('paceMinPerMi'),


	
	speedKmHr : function(){
		return this.get('lengthKm')/this.get('timeHr');
	}.property('lengthKm', 'timeHr'),

	speedKmHrStackKm : function(){
		return parseInt(this.get("speedKmHr"));
	}.property('speedKmHr'),

	speedKmHrStackM : function(){
		decimalPlace = this.get("speedKmHr") - parseInt(this.get("speedKmHr"));
		return Math.round(decimalPlace*100);
	}.property('speedKmHr'),

	speedMiHr : function(){
		return this.get('lengthMi')/this.get('timeHr');
	}.property('lengthMi', 'timeHr'),

	speedMiHrStackKm : function(){
		return parseInt(this.get("speedMiHr"));
	}.property('speedMiHr'),

	speedMiHrStackM : function(){
		decimalPlace = this.get("speedMiHr") - parseInt(this.get("speedMiHr"));
		return Math.round(decimalPlace*100);
	}.property('speedMiHr')
});