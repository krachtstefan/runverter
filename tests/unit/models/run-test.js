import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('run', 'Run Model');

test('run is a valid ember data Model', function(assert) {
	var store = this.store();
  var run = this.subject();
  assert.ok(run);
  assert.ok(run instanceof DS.Model);
});

test('timeMin property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 3600, lenghtM : 12345});
  assert.equal(run.get("timeMin"), 60);
});

test('timeMin can round down', function(assert) {
	var run = this.subject({timeSec : 2612, lenghtM : 12345});
  assert.equal(run.get("timeMin"), 43.53);
});

test('timeMin can round up', function(assert) {
	var run = this.subject({timeSec : 2614, lenghtM : 12345});
  assert.equal(run.get("timeMin"), 43.57);
});

test('timeHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 14400, lenghtM : 12345});
  assert.equal(run.get("timeHr"), 4);
});

test('timeHr can round down', function(assert) {
	var run = this.subject({timeSec : 14560, lenghtM : 12345});
  assert.equal(run.get("timeHr"), 4.04);
});

test('timeHr can round up', function(assert) {
	var run = this.subject({timeSec : 14860, lenghtM : 12345});
  assert.equal(run.get("timeHr"), 4.13);
});