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
      label : "Hi! I'm the",
      description : "Some description."
    },
    {
      route : "lengthConverter",
      name : "Lenght Converter",
      label : "This is the",
      description : "Here you can convert the major. And yes, length matters."
    },
    {
      route : "racePredictor",
      name : "Race Predictor",
      label : "This space is reserved for the",
      description : "Not quite ready yet..."
    },
    {
      route : "splitsCalculator",
      name : "Split Time Calculator",
      label : "Unfortunately this is not the",
      description : "This feature will come pretty soon. I promise."
    }
  ],

  menuItemsSelected : function() {
    var currentPath = this.get("currentPath").split(".")[0];
    var foundMenuItem = this.get("menuItems").findBy("route", currentPath);
    return foundMenuItem ? foundMenuItem : this.get("menuItems")[0];
  }.property('currentPath'),

  actions: {
    navigateTo: function(selection, component) {
      this.transitionToRoute(selection);
    }
  }
});
