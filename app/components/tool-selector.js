import Ember from 'ember';
export default Ember.Component.extend({
  actions: {
    switchTool: function(toolKey) {
      this.sendAction('action', toolKey);
    }
  }
});
