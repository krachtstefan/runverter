import Ember from 'ember';
export default Ember.Component.extend({
  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "pc" ? true : false;
  })
});
