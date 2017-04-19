import Ember from 'ember';
export default Ember.Component.extend({
  elementId: "notification-container",
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),

  init() {
    this._super(...arguments);
    var self = this;
    if(this.get("settings.displayReleaseNotesSplitsCalculator")===true && this.get("isIos") === false){
      this.set("settings.displayReleaseNotesSplitsCalculator", false);
      this.get('notifications').success(this.get('i18n').t("flashMessages.releaseNotesSplitsCalculator"), {
        onClick() {
          self.get("settings").save();
        }
      });
    }
  },

  isIos : Ember.computed(function(){
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return true;
    }else{
      return false;
    }
  }),

  clearReleaseNotesRacePredictor : Ember.on("init", Ember.observer('selectedMenuItem', function(){
    // when entering splits calculator component, find the splits calculator announcement notification and remove it
    // also make sure to not display it again
    if(this.get("selectedMenuItem.key")==="sc"){
      var relaseNotesMessage = this.get("notifications.content").filterBy('message.string', this.get('i18n').t("flashMessages.releaseNotesSplitsCalculator").string);
      if(relaseNotesMessage.length > 0){
        this.get('notifications').removeNotification(relaseNotesMessage[0]);
        this.set("settings.displayReleaseNotesSplitsCalculator", false);
        this.get("settings").save();
      }
    }
  })),
});
