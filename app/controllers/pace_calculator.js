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
	]
});