import Ember from 'ember';
import $ from 'jquery';
export default Ember.View.extend({
  didInsertElement: function() {
    $("select.menu").selectOrDie({customID:"menu"});
  }
});
