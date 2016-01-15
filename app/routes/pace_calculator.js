import Ember from 'ember';
export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('run', {
    	timeSec : new BigNumber(3600*4),
    	lengthM : new BigNumber(42195)
    });
  }
});
