Runverter.Run = DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return this.get('timeSec')/60;
	}.property('timeSec'),

	timeHr : function(){
		return this.get('timeSec')/60/60;
	}.property('timeSec'),

	timeArr : function(){
		whole_hours = parseInt(this.get("timeHr"))
		whole_minutes = parseInt(this.get("timeMin"))
		minutes_remainder = whole_minutes-(whole_hours*60)
		seconds_remainder = this.get("timeSec")-(whole_minutes*60)
		return [ whole_hours , minutes_remainder, seconds_remainder];
	}.property('timeSec', 'timeMin', 'timeHr'),


	lenghtM : null,

	lengthMiles : function(){
		return this.get('lenghtM')*0.000621371;
	}.property('lenghtM'),

	lengthMilesArr : function(){
		return this.get("lengthMiles").toFixed(2).split(".", 2)
	}.property('lengthMiles'),

	lengthKm : function(){
		return this.get('lenghtM')*0.001;
	}.property('lenghtM'),

	lengthKmArr : function(){
		return this.get("lengthKm").toFixed(2).split(".", 2)
	}.property('lengthKm'),

	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmArr : function(){
		return [1, 2];
	}.property('paceMinPerKm'),
	
	paceMinPerMile  : function(){
		return this.get('timeMin')/this.get('lengthMiles');
	}.property('timeSec', 'lengthMiles'),

	paceMinPerMileArr : function(){
		return [1, 2];
	}.property('paceMinPerMile'),
	

	speedKmHr : function(){
		return this.get('lengthKm')/this.get('timeHr');
	}.property('lengthKm', 'timeHr'),

	speedKmHrArr : function(){
		return [1, 2];
	}.property('speedKmHr'),

	speedMilesHr : function(){
		return this.get('lengthMiles')/this.get('timeHr');
	}.property('lengthMiles', 'timeHr'),

	speedMilesHrArr : function(){
		return [1, 2];
	}.property('speedMilesHr'),
})