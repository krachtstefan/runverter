import Ember from 'ember';
import $ from 'jquery';
import { computed } from '@ember/object';
export default Ember.Component.extend({

  classNames: ["suggest-select"],

  attributeBindings: ['style'],

  style: computed('items', function () {
    var Style = this.get("items").length === 0 ? "display:none" : null;
    return Ember.String.htmlSafe(Style);
  }),

  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie({customID: this.get("identifier") });
    });
  },

  didRender: function(){
    // ensure selectOrDie update on language change
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie("update");
    });
  },

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
