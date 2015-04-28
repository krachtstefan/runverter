Runverter.Run = DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return this.get('timeSec')/60;
	}.property('timeSec'),

	timeHour : function(){
		return this.get('timeSec')/60/60;
	}.property('timeSec'),

	timeArr : function(){
		return [];
	}.property('timeSec'),


	lenghtM : null,

	lengthMiles : function(){
		return this.get('lenghtM')*0.000621371;
	}.property('lenghtM'),

	lengthMilesArr : function(){
		return [1, 2];
	}.property('lenghtM'),

	lengthKm : function(){
		return this.get('lenghtM')*0.001;
	}.property('lenghtM'),

	lengthKmArr : function(){
		return [];
	}.property('lenghtM'),

	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmArr : function(){
		return [];
	}.property('paceMinPerKm'),
	
	paceMinPerMile  : function(){
		return this.get('timeMin')/this.get('lengthMiles');
	}.property('timeSec', 'lengthMiles'),

	paceMinPerMileArr : function(){
		return [];
	}.property('paceMinPerMile'),
	

	speedKmHour : function(){
		return this.get('lengthKm')/this.get('timeHour');
	}.property('lengthKm', 'timeHour'),

	speedKmHourArr : function(){
		return [];
	}.property('speedKmHour'),

	speedMilesHour : function(){
		return this.get('lengthMiles')/this.get('timeHour');
	}.property('lengthMiles', 'timeHour'),

	speedMilesHourArr : function(){
		return [];
	}.property('speedMilesHour'),
})