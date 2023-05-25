import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
  elementId: 'notification-container',
  notifications: service('notification-messages'),
  i18n: service(),
  init() {
    this._super(...arguments);
  },
});
