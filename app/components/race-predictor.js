import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),
  achievedRacePickerVisible: false,
  achievedTimePickerVisible: false,
  predictedRacePickerVisible: false,
  predictedTimePickerVisible: false,

  races : Ember.inject.service('race'),
  targetTimes : Ember.inject.service('target-time'),

  isTouchDevice : Ember.computed(function(){
    return 'ontouchstart' in document.documentElement;
  }),

  visible: Ember.computed('selectedMenuItem', function () {
    return this.get("selectedMenuItem.key") === "rp" ? true : false;
  }),

  achievedRacePickerVisibleClass: Ember.computed('achievedRacePickerVisible', function () {
    return this.get("achievedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  achievedTimePickerVisibleClass: Ember.computed('achievedTimePickerVisible', function () {
    return this.get("achievedTimePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  predictedRacePickerVisibleClass: Ember.computed('predictedRacePickerVisible', function () {
    return this.get("predictedRacePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  predictedTimePickerVisibleClass: Ember.computed('predictedTimePickerVisible', function () {
    return this.get("predictedTimePickerVisible") === true || this.get("isTouchDevice") === true ? "suggestSelectVisible" : "suggestSelectInvisible";
  }),

  expertModeClass : Ember.computed("expertMode", function(){
    return this.get("expertMode") === true ? "" : "uk-width-medium-4-6 uk-width-large-3-5";
  }),
});
