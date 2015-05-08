Runverter.ApplicationController = Ember.Controller.extend({
  init: function () {
    this._super();
    Em.I18n.translations = Runverter.I18n.en;
  }
});