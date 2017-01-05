import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "rp" ? true : false;
  }),
});
