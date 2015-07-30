import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
	contentBinding : "controller",
  didInsertElement: function() {
    $(".selectordie").selectOrDie();
  }
});