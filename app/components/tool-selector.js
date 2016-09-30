import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie({customID:"menu"}).ready(function() {
        $("select.menu").selectOrDie("update"); // need to trigger update to select the correct initial value
      });
    });
  },

  didInitAttrs() {
    this._super(...arguments);
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  updateSelectOrDieOnLanguageChange: Ember.observer("i18n.locale", function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select.menu").selectOrDie("update");
    });
  }),

  actions: {
    switchTool: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
