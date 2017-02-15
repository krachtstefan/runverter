import Ember from 'ember';
export default Ember.Component.extend({
  elementId: "notification-container",
  flashMessages: Ember.inject.service()
});
