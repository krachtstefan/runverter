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
test('turningPointSplit represents the split with the turning point', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
    assert.strictEqual(splits.get("turningPointSplit").toString(), "22");
  });
});

test('turningPointSplit is the lower one when the turning point is exactly between two splits', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20000)
      })
    );
    assert.strictEqual(splits.get("turningPointSplit").toString(), "10");
  });
});

// turningPointM
test('turningPointM represents the turning point position of the run', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
    assert.strictEqual(splits.get("turningPointM").toString(), "21097.5");
  });
});

// turningPointWithinSplit
test('turningPointWithinSplit is true when the turning is somewhere within a split', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(42195)
      })
    );
    assert.strictEqual(splits.get("turningPointWithinSplit"), true);
  });
});

test('turningPointWithinSplit is false when the turning is at the border of two splits', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20000)
      })
    );
    assert.strictEqual(splits.get("turningPointWithinSplit"), false);
  });
});

// splitTime
test('splitTime represents the time needed for a split when the pace is even', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20500)
      })
    );
    assert.strictEqual(splits.get("splitTime").toString(), "702.4390243902439024390243902"); // 4 hours, 20.5 splits
  });
});

// lastSplitTime
test('lastSplitTime represents the time needed for the the last split when the pace is even', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600*4),
        lengthM : new BigNumber(20500)
      })
    );
    assert.strictEqual(splits.get("lastSplitTime").toString(), "351.219512195121951219512196"); // 4 hours, 20.5 splits
  });
});

// averagePaceFirstHalf
test('averagePaceFirstHalf represents the average pace for the first half of the run', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceFirstHalf").toString(), "6");
  });
});

test('averagePaceFirstHalf increases when splittingStrategy does', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(50)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceFirstHalf").toString(), "9");
  });
});

test('averagePaceFirstHalf decreases when splittingStrategy does', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(-50)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceFirstHalf").toString(), "3");
  });
});

// averagePaceSecondHalf
test('averagePaceSecondHalf represents the average pace for the first half of the run', function(assert) {
  const splits = this.subject(), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceSecondHalf").toString(), "6");
  });
});

test('averagePaceSecondHalf decreases when splittingStrategy increases', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(50)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceSecondHalf").toString(), "3");
  });
});

test('averagePaceSecondHalf increases when splittingStrategy decreases', function(assert) {
  const splits = this.subject({splittingStrategy : new BigNumber(-50)}), self = this;
  Ember.run(function(){
    splits.set('run',
      self.store().createRecord('run',{
        timeSec : new BigNumber(3600),
        lengthM : new BigNumber(10000)
      })
    );
    assert.strictEqual(splits.get("averagePaceSecondHalf").toString(), "9");
  });
});

// evenSlope
test('evenSlope is a boolean', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(typeof(splits.get("evenSlope")), "boolean");
  });
});

test('evenSlope is false by default', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("evenSlope"), false);
  });
});

// slope

// splits
test('splits is an array', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splits").constructor, Array);
  });
});

test('splits is empty by default', function(assert) {
  const splits = this.subject();
  Ember.run(function(){
    assert.strictEqual(splits.get("splits").length, 0);
  });
});

// calculateSplits
