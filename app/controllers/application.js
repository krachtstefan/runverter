import Ember from 'ember';
export default Ember.Controller.extend({
  menuItems : [
    {
      route : "paceCalculator",
      name : "Pace Calculator",
      label : "You're using the",
      description : "See which pace you need, to finish a run in your desired time."
    },
    {
      route : "paceConverter",
      name : "Pace Converter",
      label : "You're using the",
      description : "Some description."
    },
    {
      route : "lengthConverter",
      name : "Lenght Converter",
      label : "km",
      description : "Some description."
    },
    {
      route : "racePredictor",
      name : "Race Predictor",
      label : "You're using the",
      description : "Some description."
    },
    {
      route : "splitsCalculator",
      name : "Split Time Calculator",
      label : "You're using the",
      description : "Some description."
    }
  ],
  actions: {
    navigateTo: function(selection, component) {

      this.transitionTo(selection);
    }
  }
});
