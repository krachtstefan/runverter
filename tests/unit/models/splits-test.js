import DS from 'ember-data';
// import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('splits', 'Splits Model', {
  needs: ['model:run']
});

test('splits is a valid ember data Model', function(assert) {
  var splits = this.subject();
  assert.ok(splits);
  assert.ok(splits instanceof DS.Model);
});

// createdAt
test('createdAt is from type Date', function(assert) {
  var splits = this.subject();
  assert.strictEqual(splits.get("createdAt").constructor.name , "Date");
});

test('createdAt equals current date', function(assert) {
  var splits = this.subject();
  var today = new Date();
  assert.strictEqual(splits.get("createdAt").toString() , today.toString());
});

// updatedAt
test('updatedAt is from type Date', function(assert) {
  var splits = this.subject();
  assert.strictEqual(splits.get("createdAt").constructor.name , "Date");
});

test('updatedAt equals current date', function(assert) {
  var splits = this.subject();
  var today = new Date();
  assert.strictEqual(splits.get("updatedAt").toString() , today.toString());
});
