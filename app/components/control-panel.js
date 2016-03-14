import Ember from 'ember';
export default Ember.Component.extend({
  actions: {
    toggleControlPanel: function() {
      this.sendAction('toggleControlPanelAction');
    }
  }
});
