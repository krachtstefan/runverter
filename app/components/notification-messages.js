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

  clearReleaseNotesRacePredictor : Ember.on("init", Ember.observer('selectedMenuItem', function(){
    // when entering race predictor component, find the race predictor announcement notification and remove it
    // also make sure to not display it again
    if(this.get("selectedMenuItem.key")==="rp"){
      var relaseNotesMessage = this.get("flashMessages.queue").filterBy('identifier', "releaseNotesRacePredictor");
      if(relaseNotesMessage.length > 0){
        relaseNotesMessage[0].destroyMessage();
      }
      this.set("settings.displayReleaseNotesRacePredictor", false);
      this.get("settings").save();
    }
  })),
});
