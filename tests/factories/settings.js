import FactoryGuy from 'ember-data-factory-guy';
FactoryGuy.define('settings', {
  traits: {
    noPeterRiegelExlanation : { "displayPeterRiegelExlanation" : false },
    noReleaseNotesRacePredictor : { "displayReleaseNotesRacePredictor" : false }
  }
});
