import DS from 'ember-data';
export default DS.Model.extend({
  /**
   *  Explain the peter riegel limitations to the user if the provides races may not be
   *  suitable for the race predictor, will be stored in database
   *
   * @type {Boolean}
   */
  displayPeterRiegelExlanation: DS.attr('boolean', {
    defaultValue() { return true; }
  }),

  /**
   *  Display release notes for race predictor
   *
   * @type {Boolean}
   */
  displayReleaseNotesRacePredictor: DS.attr('boolean', {
    defaultValue() { return true; }
  }),

  /**
   * createdAt represents the creation date of the settings, will be stored in database
   * and should be set on create
   *
   * @type {Date}
   */
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  /**
   * updatedAt represents the updating date of the settings, will be stored in database
   * and should be set on create on on every page visit
   *
   * @type {Date}
   */
  updatedAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

  /**
   * update updatedAt before saving the settings
   */
  save: function(){
    this.set("updatedAt", new Date());
    this._super(...arguments);
  },
});
