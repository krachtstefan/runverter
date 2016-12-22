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

// predictedRun
test('predictedRun is a relation to run model', function(assert) {
  const prediction = this.store().modelFor('prediction');
  const relationship = Ember.get(prediction, 'relationshipsByName').get('predictedRun');
  assert.equal(relationship.key, 'predictedRun');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});
