import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
  elementId: "notification-container",
  notifications: service('notification-messages'),
  i18n: service(),
   init() {
    this._super(...arguments);
    var self = this;

    if(this.get("settings.displayRacedaymeNote")===true && this.get("isEmbedded")===false){
      this.set("settings.displayRacedaymeNote", false);
      this.get('notifications').success(this.get('i18n').t("flashMessages.racedayme"), {
        onClick() {
          self.get("settings").save();
        }
      });
    }
  }
});
