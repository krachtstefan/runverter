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

// timeMin
test('timeMin property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 3600});
  assert.equal(run.get("timeMin"), 60);
});

test('timeMin can round down', function(assert) {
	var run = this.subject({timeSec : 2612});
  assert.equal(run.get("timeMin"), 43.53);
});

test('timeMin can round up', function(assert) {
	var run = this.subject({timeSec : 2614});
  assert.equal(run.get("timeMin"), 43.57);
});

// timeHr
test('timeHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 14400});
 	assert.equal(run.get("timeHr"), 4);
});

test('timeHr can round down', function(assert) {
	var run = this.subject({timeSec : 14560});
  assert.equal(run.get("timeHr"), 4.04);
});

test('timeHr can round up', function(assert) {
	var run = this.subject({timeSec : 14860});
  assert.equal(run.get("timeHr"), 4.13);
});

// timeStackSec
test('timeStackSec property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 62});
 	assert.equal(run.get("timeStackSec"), 2);
});

// timeStackMin
test('timeStackMin property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 145});
 	assert.equal(run.get("timeStackMin"), 2);
});

// timeStackHr
test('timeStackHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 20000});
 	assert.equal(run.get("timeStackHr"), 5);
});

// lengthMi
test('lengthMi property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1609.344});
 	assert.equal(run.get("lengthMi"), 1);
});

test('lengthMi has 4 digit precision', function(assert) {
	var run = this.subject({lenghtM : 12000});
 	assert.equal(run.get("lengthMi"), 7.4565);
});

// lengthMiStackMi
test('lengthMiStackMi property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1800});
 	assert.equal(run.get("lengthMiStackMi"), 1);
});

// lengthMiStackM
test('lengthMiStackM property is calculated from lenghtM and can round up', function(assert) {
	var run = this.subject({lenghtM : 1712});
 	assert.equal(run.get("lengthMiStackM"), 06);
});

test('lengthMiStackM can round down', function(assert) {
	var run = this.subject({lenghtM : 1800});
 	assert.equal(run.get("lengthMiStackM"), 12);
});

test('lengthMiStackM can be zero', function(assert) {
	var run = this.subject({lenghtM : 1609.344});
 	assert.equal(run.get("lengthMiStackM"), 0);
});

// lengthKm
test('lengthKm property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 2000});
 	assert.equal(run.get("lengthKm"), 2);
});

test('lengthKm has 4 digit precision and can round up', function(assert) {
	var run = this.subject({lenghtM : 1234.56});
 	assert.equal(run.get("lengthKm"), 1.2346);
});

test('lengthKm can round down', function(assert) {
	var run = this.subject({lenghtM : 1234.52});
 	assert.equal(run.get("lengthKm"), 1.2345);
});