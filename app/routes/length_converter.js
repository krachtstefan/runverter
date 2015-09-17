import Ember from 'ember';
export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('run', {
      timeSec : 3600*4,
      lengthM : 42195
    });
  }
});
