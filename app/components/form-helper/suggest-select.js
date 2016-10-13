import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  classNames: ["suggest-select"],

  attributeBindings: ['style'],

  style: Ember.computed('items', function () {
    return this.get("items").length === 0 ? "display:none" : null;
  }),

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

  updateSelectOrDieOn: Ember.observer("i18n.locale", "items", function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie("update"); // need to trigger update after every render, language may have changed
    });
  }),

  actions: {
    changeSelection: function(toolKey) {
      this.sendAction('action', toolKey);
      if(toolKey !== null){
        // always change back to the invisible empty value to make it possible to select the same value twice in a row (including the change event)
        $("select."+this.get("identifier")).val("").change();
      }
    }
  }
});
