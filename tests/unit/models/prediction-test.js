import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('prediction', 'Prediction Model', {
  needs: ['model:run']
});

test('prediction is a valid ember data Model', function(assert) {
  var prediction = this.subject();
  assert.ok(prediction);
  assert.ok(prediction instanceof DS.Model);
});

// predictedRunRaw
test('predictedRunRaw is a relation to run model', function(assert) {
  const prediction = this.store().modelFor('prediction');
  const relationship = Ember.get(prediction, 'relationshipsByName').get('predictedRunRaw');
  assert.equal(relationship.key, 'predictedRunRaw');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});

// predictedRun
test('predictedRun behaves like run model', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.set('predictedRun',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
  });
  assert.strictEqual(prediction.get("predictedRun.timeHrRaw").toString(), "4");
});

test('predictedRun has a default value', function(assert) {
  var prediction = this.subject();
  assert.strictEqual(prediction.get("predictedRun.timeHrRaw").toString(), "0");
});

test('predictedRun can be changed with a hash', function(assert) {
  var prediction = this.subject();
  Ember.run(function(){
    prediction.set('predictedRun', {timeSec : new BigNumber(1234), lengthM : new BigNumber(12)});
  });
  assert.strictEqual(prediction.get("predictedRun.timeSec").toString(), "1234");
  assert.strictEqual(prediction.get("predictedRun.lengthM").toString(), "12");
});

test('predictedRun changes when achievedRun was created', function(assert) {
  var prediction = this.subject(), self = this;
  var defaultPredictedRunValue = prediction.get("predictedRun.timeSec");
  assert.strictEqual(prediction.get("predictedRun.timeSec").toString(), defaultPredictedRunValue.toString());
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(20000),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), defaultPredictedRunValue.toString());
});

test('predictedRun changes when achievedRun time does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(20000),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });
  var initialPredictedRunValue = prediction.get("predictedRun.timeSec");
  Ember.run(function(){ prediction.set('achievedRun', { timeSec : 3060 }); });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), initialPredictedRunValue.toString());
});

test('predictedRun changes when achievedRun length does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(20000),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });
  var initialPredictedRunValue = prediction.get("predictedRun.timeSec");
  Ember.run(function(){ prediction.set('achievedRun', { lengthM : 20000 }); });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), initialPredictedRunValue.toString());
});

test('predictedRun works with a 10k example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(20000),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });

  // 10k in 50 minutes, 20k? = 1:44:15
  assert.strictEqual(prediction.get("predictedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("predictedRun.timeStackMin").toString(), "44");
  assert.strictEqual(prediction.get("predictedRun.timeStackSec").toString(), "15");
});

test('predictedRun works with a mile example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(8046.72),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(495), lengthM : new BigNumber(1609.344) })
    });
  });

  // 1 mi in 0:08:15, 5 mi? = 45:26
  assert.strictEqual(prediction.get("predictedRun.timeStackHr").toString(), "0");
  assert.strictEqual(prediction.get("predictedRun.timeStackMin").toString(), "45");
  assert.strictEqual(prediction.get("predictedRun.timeStackSec").toString(), "26");
});

test('predictedRun works with a marathon example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun.lengthM" : new BigNumber(21097.5),
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(12404), lengthM : new BigNumber(42195) })
    });
  });

  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.get("predictedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("predictedRun.timeStackMin").toString(), "39");
  assert.strictEqual(prediction.get("predictedRun.timeStackSec").toString(), "9");
});


test('predictedRun works when the run is definied with lengthKm and timeMin setter', function(assert) {
  var prediction = this.subject();
  Ember.run(function(){
    prediction.setProperties({
      "predictedRun" : { lengthKm : new BigNumber(21.0975) },
      "achievedRun" : { lengthKm : new BigNumber(42.195), timeMin : new BigNumber(44).div(60).plus(206) },
    });
  });

  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.get("predictedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("predictedRun.timeStackMin").toString(), "39");
  assert.strictEqual(prediction.get("predictedRun.timeStackSec").toString(), "9");
});

// achievedRunRaw
test('achievedRunRaw is a relation to run model', function(assert) {
  const prediction = this.store().modelFor('prediction');
  const relationship = Ember.get(prediction, 'relationshipsByName').get('achievedRunRaw');
  assert.equal(relationship.key, 'achievedRunRaw');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});

// achievedRun
test('achievedRun behaves like run model', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.set('achievedRun',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
  });
  assert.strictEqual(prediction.get("achievedRun.timeHrRaw").toString(), "4");
});

test('achievedRun has a default value', function(assert) {
  var prediction = this.subject();
  assert.strictEqual(prediction.get("achievedRun.timeHrRaw").toString(), "0");
});

test('achievedRun can be changed with a hash', function(assert) {
  var prediction = this.subject();
  Ember.run(function(){
    prediction.set('achievedRun', {timeSec : new BigNumber(1234), lengthM : new BigNumber(12)});
  });
  assert.strictEqual(prediction.get("achievedRun.timeSec").toString(), "1234");
  assert.strictEqual(prediction.get("achievedRun.lengthM").toString(), "12");
});

test('achievedRun time changes when predictedRun was created', function(assert) {
  var prediction = this.subject(), self = this;
  var defaultAchievedRunValue = prediction.get("achievedRun.timeSec");
  assert.strictEqual(prediction.get("achievedRun.timeSec").toString(), defaultAchievedRunValue.toString());
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(20000),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });
  assert.notStrictEqual(prediction.get("achievedRun.timeSec").toString(), defaultAchievedRunValue.toString());
});

test('achievedRun time changes when predictedRun time does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(20000),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });
  var initialAchievedRunValue = prediction.get("achievedRun.timeSec");
  Ember.run(function(){ prediction.set('predictedRun', { timeSec : 3060 }); });
  assert.notStrictEqual(prediction.get("achievedRun.timeSec").toString(), initialAchievedRunValue.toString());
});

test('achievedRun time changes when predictedRun length does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(20000),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) }),
    });
  });
  var initialPredictedRunValue = prediction.get("achievedRun.timeSec");
  Ember.run(function(){ prediction.set('predictedRun', { lengthM : 20000 }); });
  assert.notStrictEqual(prediction.get("achievedRun.timeSec").toString(), initialPredictedRunValue.toString());
});

test('achievedRun time changes with a 10k example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(20000),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) })
    });
  });

  // 10k in 50 minutes, 20k? = 1:44:15
  assert.strictEqual(prediction.get("achievedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("achievedRun.timeStackMin").toString(), "44");
  assert.strictEqual(prediction.get("achievedRun.timeStackSec").toString(), "15");
});

test('achievedRun time changes with a mile example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(8046.72),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(495), lengthM : new BigNumber(1609.344) })
    });
  });

  // 1 mi in 0:08:15, 5 mi? = 45:26
  assert.strictEqual(prediction.get("achievedRun.timeStackHr").toString(), "0");
  assert.strictEqual(prediction.get("achievedRun.timeStackMin").toString(), "45");
  assert.strictEqual(prediction.get("achievedRun.timeStackSec").toString(), "26");
});

test('achievedRun time changes with a marathon example', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun.lengthM" : new BigNumber(21097.5),
      "predictedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(12404), lengthM : new BigNumber(42195) })
    });
  });

  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.get("achievedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("achievedRun.timeStackMin").toString(), "39");
  assert.strictEqual(prediction.get("achievedRun.timeStackSec").toString(), "9");
});

test('achievedRun time changes when the run is definied with lengthKm and timeMin setter', function(assert) {
  var prediction = this.subject();
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun" : { lengthKm : new BigNumber(21.0975) },
      "predictedRun" : { lengthKm : new BigNumber(42.195), timeMin : new BigNumber(44).div(60).plus(206) },
    });
  });

  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.get("achievedRun.timeStackHr").toString(), "1");
  assert.strictEqual(prediction.get("achievedRun.timeStackMin").toString(), "39");
  assert.strictEqual(prediction.get("achievedRun.timeStackSec").toString(), "9");
});

// peterRiegelMethod
test('peterRiegelMethod works (with integers)', function(assert) {
  var prediction = this.subject();
  // 10k in 50 minutes, 20k? = 1:44:15
  assert.strictEqual(prediction.peterRiegelMethod(10, 20, 50).toString(), "104.2465760841121391"); // 104.2465760841121390955
});

test('peterRiegelMethod works (with Strings)', function(assert) {
  var prediction = this.subject();
  // 1 mi in 0:08:15, 5 mi? = 45:26
  assert.strictEqual(prediction.peterRiegelMethod("1.609344", "8.04672", "495" ).toString(), "2725.9218671239174489"); // 2725.921867123917448922
});

test('peterRiegelMethod works (with BigNumbers)', function(assert) {
  var prediction = this.subject();
  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.peterRiegelMethod(new BigNumber(42.195), new BigNumber(21.0975), new BigNumber(12404)).toString(), "5949.3560680552897476"); // 5949.3560680552897476
});

test('peterRiegelMethod will predict the same time if input and output length are equal ', function(assert) {
  var prediction = this.subject();
  assert.strictEqual(prediction.peterRiegelMethod("1.2345", "1.2345", "5.6789" ).toString(), "5.6789");
});

test('peterRiegelMethod will handle division by zero', function(assert) {
  var prediction = this.subject();
  assert.strictEqual(prediction.peterRiegelMethod("0", "1234", "5678" ).toString(), "0");
});

// peterRiegelMethodReversed
test('peterRiegelMethodReversed works (with integers)', function(assert) {
  var prediction = this.subject();
  // 10k in 50 minutes, 20k? = 1:44:15
  assert.strictEqual(prediction.peterRiegelMethodReversed(10, 20, 6255).toString(), "3000.0985331897643802"); // 3000.098533189764380139 (does not match precisely but good enough)
});

test('peterRiegelMethodReversed works (with String)', function(assert) {
  var prediction = this.subject();
  // 1 mi in 0:08:15, 5 mi? = 45:26
  assert.strictEqual(prediction.peterRiegelMethodReversed("1.609344", "8.04672", "2715").toString(), "493.01669875738468054"); // 493.0166987573846805397
});

test('peterRiegelMethodReversed works (with BigNumbers)', function(assert) {
  var prediction = this.subject();
  // Marathon in 3:26:44, Half Marathon? = 1:39:09
  assert.strictEqual(prediction.peterRiegelMethodReversed(new BigNumber(42.195), new BigNumber(21.0975), new BigNumber(5949)).toString(), "12403.257622487662309"); // 12403.25762248766230958 (does not match precisely but good enough)
});

// private helper methods
test('_ensureDecimal can handle numeric strings', function(assert) {
  var ensureDecimal = this.subject()._ensureDecimal("1");
  assert.strictEqual(ensureDecimal instanceof Decimal, true);
  assert.strictEqual(ensureDecimal.toString(), "1");

  ensureDecimal = this.subject()._ensureDecimal("1.1");
  assert.strictEqual(ensureDecimal instanceof Decimal, true);
  assert.strictEqual(ensureDecimal.toString(), "1.1");
});

test('_ensureDecimal can handle floats', function(assert) {
  var ensureDecimal = this.subject()._ensureDecimal(1.1);
  assert.strictEqual(ensureDecimal instanceof Decimal, true);
  assert.strictEqual(ensureDecimal.toString(), "1.1");
});

test('_ensureDecimal will leave Decimal input unchanged', function(assert) {
  var bigNumber = new Decimal(1.23456);
  var ensureDecimal = this.subject()._ensureDecimal(bigNumber);
  assert.strictEqual(ensureDecimal instanceof Decimal, true);
  assert.strictEqual(ensureDecimal.toString(), "1.23456");
  assert.strictEqual(ensureDecimal, bigNumber);
});

test('_ensureDecimal will treat non numeric input as 0', function(assert) {
  var ensureDecimal = this.subject()._ensureDecimal("dumb user input from a random hacker kid");
  assert.strictEqual(ensureDecimal instanceof Decimal, true);
  assert.strictEqual(ensureDecimal.toString(), "0");
});

