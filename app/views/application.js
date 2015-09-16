import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie({customID:"menu"});
    });
  }
});
