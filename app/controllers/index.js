import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: {
    selectedToolKey : 't'
  },

  tools : [
    {
      key : "pca",
      name : "Pace Calculator",
      label : "You're using the",
      description : "See which pace you need, to finish a run in your desired time."
    },
    {
      key : "pc",
      name : "Pace Converter",
      label : "Hi! I'm the",
      description : "There a lots of ways to define a tempo. Here you have all in one place."
    },
    {
      key : "lc",
      name : "Lenght Converter",
      label : "This is the",
      description : "Here you can see the relation of all common length units. And yes, length matters."
    },
    {
      key : "rp",
      name : "Race Predictor",
      label : "This space is reserved for the",
      description : "Not quite ready yet..."
    },
    {
      key : "sc",
      name : "Split Time Calculator",
      label : "Unfortunately this is not the",
      description : "This feature will come pretty soon. I promise."
    }
  ],

  selectedToolKey : "pca",

  selectedTool : Ember.computed("selectedToolKey", function(){
    var selectedTool = this.get("tools").findBy("key", this.get("selectedToolKey"));
    return selectedTool;
  }),

  actions: {
    navigateTo: function(selection) {
      this.set("selectedToolKey", selection);
    }
  }
});
