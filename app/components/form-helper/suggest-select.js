import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
export default Component.extend({

  classNames: ["suggest-select"],

  attributeBindings: ['style'],

  style: computed('items', function () {
    var Style = this.get("items").length === 0 ? "display:none" : null;
    return htmlSafe(Style);
  }),

  didInsertElement: function() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie({customID: this.get("identifier") });
    });
  },

  didRender: function(){
    // ensure selectOrDie update on language change
    run.scheduleOnce('afterRender', this, function() {
      $("select."+this.get("identifier")).selectOrDie("update");
    });
  },

  actions: {
    changeSelection: function(value) {
      this.get('changeAction')(value);
      if(value !== null){
        // always change back to the invisible empty value to make it possible to select the same value twice in a row (including the change event)
        $("select."+this.get("identifier")).val("").change();
      }
    }
  }
});
