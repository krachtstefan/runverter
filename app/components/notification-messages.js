import Ember from 'ember';
export default Ember.Component.extend({
  elementId: "notification-container",
  flashMessages: Ember.inject.service(),
  i18n: Ember.inject.service(),

  init() {
    this._super(...arguments);
    var self = this;
    if(this.get("settings.displayReleaseNotesRacePredictor")===true){
      this.set("settings.displayReleaseNotesRacePredictor", false);
      this.get("flashMessages").add({
        message: this.get('i18n').t("flashMessages.releaseNotesRacePredictor"),
        type: 'info',
        sticky: true,
        identifier: 'releaseNotesRacePredictor',
        onDestroy() {
          self.get("settings").save();
        }
      });
    }
  },

});
