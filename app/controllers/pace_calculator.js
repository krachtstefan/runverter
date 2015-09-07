import Ember from 'ember';
export default Ember.Controller.extend({
	runLengthSelected : "km", 
	runLengthMetrics : [
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
	],

	showRunLengthKm: function () {
    return this.get("runLengthSelected") === "km" ? true : false;
  }.property('runLengthSelected'),

  showRunLengthMi: function () {
    return this.get("runLengthSelected") === "mi" ? true : false;
  }.property('runLengthSelected'),

  showRunTempoMinKm: function () {
    return this.get("runTempoSelected") === "minkm" ? true : false;
  }.property('runTempoSelected'),

  showRunTempoMinMi: function () {
    return this.get("runTempoSelected") === "minmi" ? true : false;
  }.property('runTempoSelected'),

  showRunTempoKmH: function () {
    return this.get("runTempoSelected") === "kmh" ? true : false;
  }.property('runTempoSelected'),

  showRunTempoMiH: function () {
    return this.get("runTempoSelected") === "mih" ? true : false;
  }.property('runTempoSelected'),
});