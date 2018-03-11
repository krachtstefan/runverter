import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
export default Component.extend({
  elementId: "notification-container",
  notifications: service('notification-messages'),
  i18n: service(),
  init() {
    this._super(...arguments);
    var self = this;

    if(this.get("settings.displayReleaseNotesDarkmode")===true){
      this.set("settings.displayReleaseNotesDarkmode", false);
      this.get('notifications').success(this.get('i18n').t("flashMessages.releaseNotesDarkmode"), {
        onClick() {
          self.get("settings").save();
        }
      });
    }
  },

  clearReleaseNotesDarkmode : observer('darkMode', function(){
    // when using darkMode find the race predictor announcement notification and remove it
    // also make sure to not display it again
    if(this.get("darkMode")===true){
      var relaseNotesMessage = this.get("notifications.content").filterBy('message.string', this.get('i18n').t("flashMessages.releaseNotesDarkmode").string);
      if(relaseNotesMessage.length > 0){
        this.get('notifications').removeNotification(relaseNotesMessage[0]);
        this.set("settings.displayReleaseNotesDarkmode", false);
        this.get("settings").save();
      }
    }
  })
});
