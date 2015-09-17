import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie({customID:"menu"}).ready(function() {
        $(".menu").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  }
});
