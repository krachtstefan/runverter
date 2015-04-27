Runverter.Run = DS.Model.extend({

	timeSec : null,
	timeArr : function(){
		return [];
	}.property('timeSec'),


	lenghtM : null,

	lengthMiles : function(){
		return null;
	}.property('lenghtM'),

	lengthKm : function(){
		return null;
	}.property('lenghtM'),

	
	paceMinPerKm : function(){
		return null;
	}.property('timeSec', 'lenghtM'),

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