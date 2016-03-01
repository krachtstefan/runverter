import Ember from 'ember';
export default Ember.Component.extend({
  visible: function () {
    return this.get("selectedMenuItem.key") === "lc" ? true : false;
  }.property('selectedMenuItem')
});
