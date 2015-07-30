import Ember from 'ember';
export default Ember.Controller.extend({
	runLengthSelected : "km", 
	runLength : [
		{
			id : "km",
			label : "km"
		},
		{
			id : "mi",
			label : "mi"
		}
	],

	runTempoSelected : "minkm", 

	runTempo : [
		{
			id : "minkm",
			label : "min/km"
		},
		{
			id : "minmi",
			label : "min/mi"
		},
		{
			id : "kmh",
			label : "km/h"
		},
		{
			id : "mih",
			label : "mi/h"
		}
	]
});