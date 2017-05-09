import Ember from 'ember';
export default Ember.Component.extend({
  elementId: "notification-container",
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service()
});
