Runverter.Run = DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return this.get('timeSec')/60;
	}.property('timeSec'),

	timeHour : function(){
		return this.get('timeSec')/60/60;
	}.property('timeSec'),

	timeArr : function(){
		return [1, 2, 3];
	}.property('timeSec'),


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
	

	speedKmHour : function(){
		return this.get('lengthKm')/this.get('timeHour');
	}.property('lengthKm', 'timeHour'),

	speedKmHourArr : function(){
		return [1, 2];
	}.property('speedKmHour'),

	speedMilesHour : function(){
		return this.get('lengthMiles')/this.get('timeHour');
	}.property('lengthMiles', 'timeHour'),

	speedMilesHourArr : function(){
		return [1, 2];
	}.property('speedMilesHour'),
})