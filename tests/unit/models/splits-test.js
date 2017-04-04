import DS from 'ember-data';
import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('splits', 'Splits Model', {
  needs: ['model:run']
});

test('splits is a valid ember data Model', function(assert) {
  var splits = this.subject();
  assert.ok(splits);
  assert.ok(splits instanceof DS.Model);
});

// run
test('run is a relation to run model', function(assert) {
  const splits = this.store().modelFor('splits');
  const relationship = Ember.get(splits, 'relationshipsByName').get('run');
  assert.equal(relationship.key, 'run');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'run');
});

// splitDistance
// splittingStrategy
// splittingStrategySecondHalf
// splitCount
// splitCountCeiled
// lastSplitDistance
// turningPointSplit
// turningPointM
// turningPointWithinSplit
// splitTime
// lastSplitTime
// averagePaceFirstHalf
// averagePaceSecondHalf
// evenSlope
// slope
// splits
// calculateSplits
