import Ember from 'ember';
export default Ember.Component.extend({
  elementId: "notification-container",
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),

  init() {
    this._super(...arguments);
    var self = this;
    if(this.get("settings.displayReleaseNotesRacePredictor")===true){
      this.set("settings.displayReleaseNotesRacePredictor", false);
      this.get('notifications').success(this.get('i18n').t("flashMessages.releaseNotesRacePredictor"), {
        onClick() {
          self.get("settings").save();
        }
      });
    }
  },

  clearReleaseNotesRacePredictor : Ember.on("init", Ember.observer('selectedMenuItem', function(){
    // when entering race predictor component, find the race predictor announcement notification and remove it
    // also make sure to not display it again
    if(this.get("selectedMenuItem.key")==="rp"){
      var relaseNotesMessage = this.get("notifications.content").filterBy('message.string', this.get('i18n').t("flashMessages.releaseNotesRacePredictor").string);
      if(relaseNotesMessage.length > 0){
        this.get('notifications').removeNotification(relaseNotesMessage[0]);
        this.set("settings.displayReleaseNotesRacePredictor", false);
        this.get("settings").save();
      }
    }
  })),
});
