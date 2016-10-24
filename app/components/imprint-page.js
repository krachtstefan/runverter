import Ember from 'ember';
export default Ember.Component.extend({

  i18n: Ember.inject.service(),

  classNames: ["imprint"],
  classNameBindings: ['visible:open'],
  visible : false,
});
