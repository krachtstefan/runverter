import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie({customID:"menu"}).ready(function() {
        $(".menu").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  didInitAttrs() {
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  updateSelectOrDieOnLanguageChange: function () {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $(".menu").selectOrDie("update"); // need to trigger update to select the correct initial value
    });
  }.observes("i18n.locale"),

  actions: {
    switchTool: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
