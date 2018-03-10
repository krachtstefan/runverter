import Component from '@ember/component';
import { inject } from '@ember/service';
export default Component.extend({
  elementId: "notification-container",
  notifications: inject.service('notification-messages'),
  i18n: inject.service()
});
