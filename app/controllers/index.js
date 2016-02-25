import Ember from 'ember';
export default Ember.Controller.extend({
  tools : [
    {
      key : "paceCalculator",
      name : "Pace Calculator",
      label : "You're using the",
      description : "See which pace you need, to finish a run in your desired time."
    },
    {
      key : "paceConverter",
      name : "Pace Converter",
      label : "Hi! I'm the",
      description : "There a lots of ways to define a tempo. Here you have all in one place."
    },
    {
      key : "lengthConverter",
      name : "Lenght Converter",
      label : "This is the",
      description : "Here you can see the relation of all major length units. And yes, length matters."
    },
    {
      key : "racePredictor",
      name : "Race Predictor",
      label : "This space is reserved for the",
      description : "Not quite ready yet..."
    },
    {
      key : "splitsCalculator",
      name : "Split Time Calculator",
      label : "Unfortunately this is not the",
      description : "This feature will come pretty soon. I promise."
    }
  ],

  selectedToolKey : "paceCalculator",

  selectedTool : Ember.computed("selectedToolKey", function(){
    var selectedTool = this.get("tools").findBy("key", this.get("selectedToolKey"));
    return selectedTool;
  }),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection.toString());
    }
  }
});
