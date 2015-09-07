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

	runTempoMetricsSelected : "minkm", 

	runTempoMetrics : [
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
    return this.get("runTempoMetricsSelected") === "minkm" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoMinMi: function () {
    return this.get("runTempoMetricsSelected") === "minmi" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoKmH: function () {
    return this.get("runTempoMetricsSelected") === "kmh" ? true : false;
  }.property('runTempoMetricsSelected'),

  showRunTempoMiH: function () {
    return this.get("runTempoMetricsSelected") === "mih" ? true : false;
  }.property('runTempoMetricsSelected'),
});