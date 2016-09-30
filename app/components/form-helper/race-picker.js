import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("id")).selectOrDie({customID: this.get("id") }).ready(function() {
        $(".menu").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  actions: {
    switchRace: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
