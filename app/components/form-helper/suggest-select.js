import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  classNames: ["suggest-select"],

  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie({customID: this.get("identifier") });
    });
  },

  didInitAttrs() {
    this._super(...arguments);
    // if not accessed once, i18n changes are not recognized by computed properties or observers
    this.get('i18n');
  },

  updateSelectOrDieOnLanguageChange: Ember.observer("i18n.locale", function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie("update"); // need to trigger update after every render, language may have changed
    });
  }),

  actions: {
    switchRace: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
