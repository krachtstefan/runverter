import Ember from 'ember';
import Component from '@ember/component';
export default Component.extend({
  elementId: "notification-container",
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service()
});
