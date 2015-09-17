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
      description : "There a lots of ways to define a tempo. Here you have all in one place."
    },
    {
      route : "lengthConverter",
      name : "Lenght Converter",
      label : "This is the",
      description : "Here you can see the relation of all major length units. And yes, length matters."
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
    return this.get("currentPath").split(".")[0];
  }.property('currentPath'),

  menuDescription : function() {
    var selectedMenuItem = this.get("menuItems").findBy("route", this.get("menuItemsSelected"));
    return selectedMenuItem.description
  }.property('menuItemsSelected'),

  menuLabel: function() {
    var selectedMenuItem = this.get("menuItems").findBy("route", this.get("menuItemsSelected"));
    return selectedMenuItem.label;
  }.property('menuItemsSelected'),

  actions: {
    navigateTo: function(selection, component) {
      this.transitionToRoute(selection);
    }
  }
});
