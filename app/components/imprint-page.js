import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
  i18n: service(),
  notifications: service('notification-messages'),

  classNames: ['imprint'],
  classNameBindings: ['visible:open', 'expertModeClass'],
  visible: false,

  actions: {
    closeImprintPage: function() {
      this.set('visible', false);
    },
    deleteStorage: function() {
      localStorage.clear();
      this.get('notifications').success(
        this.get('i18n').t('flashMessages.localstorageCleared'),
        {
          autoClear: true
        }
      );
    }
  }
});
