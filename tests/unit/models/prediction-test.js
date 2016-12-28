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
    prediction.set('achievedRun',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(42195)
      })
    );
  });
  assert.notStrictEqual(prediction.get("predictedRun.timeSec").toString(), defaultPredictedRunValue.toString());
});

test('predictedRun changes when achievedRun time does', function(assert) {
  var prediction = this.subject(), self = this;
  Ember.run(function(){
    prediction.set('achievedRun',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(42195)
      })
    );
  });
  assert.strictEqual(prediction.get("predictedRun.timeSec").toString(), "3600");
  Ember.run(function(){ prediction.set('achievedRun.timeSec', 2); });
  assert.strictEqual(prediction.get("predictedRun.timeSec").toString(), "2");
});

