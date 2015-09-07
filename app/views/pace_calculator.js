import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
	contentBinding : "controller",
	
  didInsertElement: function() {
    $("select.runLength").selectOrDie({customID:"runLength"});
    $("select.runTempo").selectOrDie({customID:"runTempo"});
  }
});