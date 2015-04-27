Runverter.Run = DS.Model.extend({

	timeSec : null,
	
	timeMin : function(){
		return this.get('timeSec')/60;
	}.property('timeSec'),

	timeArr : function(){
		return [];
	}.property('timeSec'),


	lenghtM : null,

	lengthMiles : function(){
		return this.get('lenghtM')*0.000621371;
	}.property('lenghtM'),

	lengthKm : function(){
		return this.get('lenghtM')*0.001;
	}.property('lenghtM'),

	
	paceMinPerKm : function(){
		return this.get('timeMin')/this.get('lengthKm');
	}.property('timeSec', 'lengthKm'),

	paceMinPerKmArr : function(){
		return [];
	}.property('timeSec', 'lenghtM'),
	
	paceMinPerMile  : function(){
		return null;
	}.property('timeSec', 'lenghtM'),

	paceMinPerMileArr : function(){
		return [];
	}.property('timeSec', 'lenghtM'),
	

	speedKmHour : function(){
		return null;
	}.property('timeSec', 'lenghtM'),

	speedKmHourArr : function(){
		return [];
	}.property('timeSec', 'lenghtM'),

	speedMilesHour : function(){
		return null;
	}.property('timeSec', 'lenghtM'),

	speedMilesHourArr : function(){
		return [];
	}.property('timeSec', 'lenghtM'),
})