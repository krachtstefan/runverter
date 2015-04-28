Runverter.PaceCalculatorRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord(Runverter.Run, {
    	timeSec : 3600*4,
    	lenghtM : 42195,
    });
  }
})
