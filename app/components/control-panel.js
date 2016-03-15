import Ember from 'ember';
export default Ember.Component.extend({
  visible : false,
  actions: {
    toggleControlPanel: function() {
      this.toggleProperty("visible");
    }
  }
});
