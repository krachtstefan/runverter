Runverter.PaceCalculatorRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord(Runverter.Run, {
    	timeSec : 60,
    	lenghtM : 42195,
    });
  }
})
