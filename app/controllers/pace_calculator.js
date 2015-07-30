import Ember from 'ember';
export default Ember.Controller.extend({
	runLengthSelected : "km", 
	runLength : [
		{
			id : "km",
			label : "Km"
		},
		{
			id : "mi",
			label : "Mi"
		}
	]
});