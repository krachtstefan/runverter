import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
	contentBinding : "controller",
	
	showRunLengthKm: function () {
    return this.get("content.runLengthSelected") === "km" ? true : false;
  }.property('content.runLengthSelected'),

  showRunLengthMi: function () {
    return this.get("content.runLengthSelected") === "mi" ? true : false;
  }.property('content.runLengthSelected'),

  showRunTempoMinKm: function () {
    return this.get("content.runTempoSelected") === "minkm" ? true : false;
  }.property('content.runTempoSelected'),

  showRunTempoMinMi: function () {
    return this.get("content.runTempoSelected") === "minmi" ? true : false;
  }.property('content.runTempoSelected'),

  showRunTempoKmH: function () {
    return this.get("content.runTempoSelected") === "kmh" ? true : false;
  }.property('content.runTempoSelected'),

  showRunTempoMiH: function () {
    return this.get("content.runTempoSelected") === "mih" ? true : false;
  }.property('content.runTempoSelected'),

  

  didInsertElement: function() {
    $(".selectordie").selectOrDie();
  }
});