import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';
export default Component.extend({

  i18n: Ember.inject.service(),

  classNames: ["control-panel"],
  classNameBindings: ['visible:open'],
  visible : false,
  shareButtonsVisible : false,
  imprintVisible : false,

  shareButtonsVisibleClass : computed("shareButtonsVisible", function(){
    return this.get("shareButtonsVisible") === true ? "shareButtonsVisible" : "shareButtonsInvisible";
  }),

  actions: {
    toggleControlPanel: function() {
      this.toggleProperty("visible");
    },
    closeControlPanel: function() {
      this.set("visible", false);
    },
    toggleLanguage: function() {
      const newLanguage = this.get('i18n.locale') === "en" ? "de" : "en";
      this.set("i18n.locale", newLanguage);
    },
    toggleExpertMode: function(){
      this.toggleProperty("expertMode");
    },
    openImprintPage: function() {
      this.send('closeControlPanel');
      this.set("imprintVisible", true);
    },
    toggleShareButtons: function() {
      this.toggleProperty("shareButtonsVisible");
    },
  }
});
