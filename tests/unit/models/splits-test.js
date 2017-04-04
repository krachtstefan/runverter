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
test('splitDistance is a BigNumber', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splitDistance").isBigNumber, true);
  });
});

test('splitDistance has a default value of 1000', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splitDistance").toString(), "1000");
  });
});

// splittingStrategy
test('splittingStrategy is a BigNumber', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategy").isBigNumber, true);
  });
});

test('splittingStrategy has a default value of 0', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategy").toString(), "0");
  });
});

// splittingStrategySecondHalf
test('splittingStrategySecondHalf is a BigNumber', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategySecondHalf").isBigNumber, true);
  });
});

test('splittingStrategySecondHalf has a default value of 0', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategySecondHalf").toString(), "0");
  });
});

test('splittingStrategySecondHalf is the negative when splittingStrategy is positive', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(5)});
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategySecondHalf").toString(), "-5");
  });
});

test('splittingStrategySecondHalf is the positive when splittingStrategy is negative', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(-5)});
  Ember.run(function(){
    assert.strictEqual(splits.get("splittingStrategySecondHalf").toString(), "5");
  });
});

// splitCount
test('splitCount represents the number of splits with decimal accuracy', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
    assert.strictEqual(splits.get("splitCount").toString(), "42.195");
  });
});

test('splitCount dependes on splitDistance', function(assert) {
  const splits = this.subject({splitDistance : new BigNumber(5000)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20000)
      })
    );
    assert.strictEqual(splits.get("splitCount").toString(), "4");
  });
});

// splitCountCeiled
test('splitCountCeiled represents the ceiled number of splits', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
    assert.strictEqual(splits.get("splitCountCeiled").toString(), "43");
  });
});

test('splitCountCeiled dependes on splitDistance', function(assert) {
  const splits = this.subject({splitDistance : new BigNumber(5000)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(22000)
      })
    );
    assert.strictEqual(splits.get("splitCountCeiled").toString(), "5");
  });
});

// lastSplitDistance
test('lastSplitDistance equals the remainder distance when the run is not evenly divisible by splitDistance', function(assert) {
  const splits = this.subject({splitDistance : new BigNumber(5000)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(21234)
      })
    );
    assert.strictEqual(splits.get("lastSplitDistance").toString(), "1234");
  });
});

test('lastSplitDistance equals the splitDistance when the run is evenly divisible by splitDistance', function(assert) {
  const splits = this.subject({splitDistance : new BigNumber(5000)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20000)
      })
    );
    assert.strictEqual(splits.get("lastSplitDistance").toString(), "5000");
  });
});

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
