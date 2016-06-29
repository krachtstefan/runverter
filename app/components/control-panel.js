import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  classNameBindings: ['visible:open'],

  visible : false,
  actions: {
    toggleControlPanel: function() {
      this.toggleProperty("visible");
    },
    toggleLanguage: function() {
      const newLanguage = this.get('i18n.locale') === "en" ? "de" : "en";
      this.set("i18n.locale", newLanguage);
    }
  }
});
