Runverter.PaceCalculatorRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord(Runverter.Run, {});
  }
})
