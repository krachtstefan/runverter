import DS from 'ember-data';
// import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('settings', 'Settings Model');

test('settings is a valid ember data Model', function(assert) {
  var settings = this.subject();
  assert.ok(settings);
  assert.ok(settings instanceof DS.Model);
});

// displayPeterRiegelExlanation
test('displayPeterRiegelExlanation is from type Boolean', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("displayPeterRiegelExlanation").constructor.name , "Boolean");
});

test('displayPeterRiegelExlanation is true by default', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("displayPeterRiegelExlanation") , true);
});

// displayReleaseNotesRacePredictor
test('displayReleaseNotesRacePredictor is from type Boolean', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("displayReleaseNotesRacePredictor").constructor.name , "Boolean");
});

test('displayReleaseNotesRacePredictor is true by default', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("displayReleaseNotesRacePredictor") , true);
});

// createdAt
test('createdAt is from type Date', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("createdAt").constructor.name , "Date");
});

test('createdAt equals current date', function(assert) {
  var settings = this.subject();
  var today = new Date();
  assert.strictEqual(settings.get("createdAt").toString() , today.toString());
});

// updatedAt
test('updatedAt is from type Date', function(assert) {
  var settings = this.subject();
  assert.strictEqual(settings.get("createdAt").constructor.name , "Date");
});

test('updatedAt equals current date', function(assert) {
  var settings = this.subject();
  var today = new Date();
  assert.strictEqual(settings.get("updatedAt").toString() , today.toString());
});
