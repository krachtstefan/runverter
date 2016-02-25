import Ember from 'ember';
export default Ember.Component.extend({
  visible: function () {
    return this.get("selectedMenuItem.key") === "paceConverter" ? true : false;
  }.property('selectedMenuItem')
});
