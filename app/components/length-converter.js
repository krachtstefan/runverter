import Ember from 'ember';
export default Ember.Component.extend({

  racePickerKmVisible : false,
  racePickerMiVisible : false,
  racePickerMVisible : false,

  races : Ember.inject.service('race'),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "lc" ? true : false;
  }),

  racePickerKmVisibleClass: Ember.computed('racePickerKmVisible', function () {
    return this.get("racePickerKmVisible") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMiVisibleClass: Ember.computed('racePickerMiVisible', function () {
    return this.get("racePickerMiVisible") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  racePickerMVisibleClass: Ember.computed('racePickerMVisible', function () {
    return this.get("racePickerMVisible") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  actions: {
    setRace: function(race) {
      this.get("run").set("lengthM",race.lengthM);
    }
  }
});
