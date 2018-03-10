import Ember from 'ember';
import $ from 'jquery';
import { run } from '@ember/runloop';
export default Ember.Component.extend({

  didInsertElement: function() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie({customID:"menu"}).ready(function() {
        $("select.menu").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  didRender: function(){
    this._super(...arguments);
    // ensure selectOrDie update on language change
    run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie("update");
    });
  },

  actions: {
    switchTool: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
