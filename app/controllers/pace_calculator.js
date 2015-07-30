import Ember from 'ember';
export default Ember.Controller.extend({
	runLengthSelected : "mi", 
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