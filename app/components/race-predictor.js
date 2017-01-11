import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "rp" ? true : false;
  }),
  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),
});
