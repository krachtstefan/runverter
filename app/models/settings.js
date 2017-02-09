import DS from 'ember-data';
export default DS.Model.extend({
  /**
   *  Explain the peter riegel limitations to the user if the provides races may not be suitable for the race predictor
   */
  displayPeterRiegelExlanation: DS.attr('boolean', {
    defaultValue() { return true; }
  })
});
