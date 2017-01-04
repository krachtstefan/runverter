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

// achievedRun
test('achievedRun is a relation to run model', function(assert) {
  const prediction = this.store().modelFor('prediction');
  const relationship = Ember.get(prediction, 'relationshipsByName').get('achievedRun');
  assert.equal(relationship.key, 'achievedRun');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});

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

// predictedRun
test('predictedRun is a relation to run model', function(assert) {
  const prediction = this.store().modelFor('prediction');
  const relationship = Ember.get(prediction, 'relationshipsByName').get('predictedRun');
  assert.equal(relationship.key, 'predictedRun');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});

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

test('predictedRun changes when achievedRun was created', function(assert) {
  var prediction = this.subject(), self = this;
  var defaultPredictedRunValue = prediction.get("predictedRun.timeSec");
  assert.strictEqual(prediction.get("predictedRun.timeSec").toString(), defaultPredictedRunValue.toString());
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) }),
      "predictedRun.lengthM" : new BigNumber(20000)
    });
  });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), defaultPredictedRunValue.toString());
});

test('predictedRun changes when achievedRun time does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) }),
      "predictedRun.lengthM" : new BigNumber(20000)
    });
  });
  var initialPredictedRunValue = prediction.get("predictedRun.timeSec");
  Ember.run(function(){ prediction.set('achievedRun.timeSec', 3060); });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), initialPredictedRunValue.toString());
});

test('predictedRun changes when achievedRun time does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.setProperties({
      "achievedRun" : self.store().createRecord('run',{ timeSec : new BigNumber(3000), lengthM : new BigNumber(10000) }),
      "predictedRun.lengthM" : new BigNumber(20000)
    });
  });
  var initialPredictedRunValue = prediction.get("predictedRun.timeSec");
  Ember.run(function(){ prediction.set('achievedRun.lengthM', 20000); });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), initialPredictedRunValue.toString());
});

// peterRiegelMethod
test('peterRiegelMethod works (with integers)', function(assert) {
  var prediction = this.subject();
  // 10k in 50 minutes, 20k? = 1:44:15
  assert.strictEqual(prediction.peterRiegelMethod(10, 20, 50).toString(), "104.2465760841121391"); // 104.2465760841121390955
});

test('peterRiegelMethod works (with BigNumber)', function(assert) {
  var prediction = this.subject();
  // Marathon in 3:26:44, Half Marathon? = 1:39:10 (runcalc.net says 1:39:09 but it's not rounded properly)
  assert.strictEqual(prediction.peterRiegelMethod(new BigNumber(42.195), new BigNumber(21.0975), new BigNumber(44).div(60).plus(206)).toString(), "99.155934467588156066"); // 99.15593446758816246001 (does not match precisely but good enoguh)
});

test('peterRiegelMethod will predict the same time if input and output length are equal ', function(assert) {
  var prediction = this.subject();
  assert.strictEqual(prediction.peterRiegelMethod("1.2345", "1.2345", "5.6789" ).toString(), "5.6789");
});

test('peterRiegelMethod works (with String)', function(assert) {
  var prediction = this.subject();
  // 1 mi in 0:08:15, 5 mi? = 45:26
  assert.strictEqual(prediction.peterRiegelMethod("1.609344", "8.04672", "8.25" ).toString(), "45.432031118731957482"); // 45.43203111873195748203
});
