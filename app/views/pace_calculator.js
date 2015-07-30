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

  didInsertElement: function() {
    $(".selectordie").selectOrDie();
  }
});