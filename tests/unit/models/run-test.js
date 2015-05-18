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
  assert.strictEqual(run.get("timeMin"), "60.0000");
});

test('timeMin can round down', function(assert) {
	var run = this.subject({timeSec : 2612});
  assert.strictEqual(run.get("timeMin"), "43.5333");
});

test('timeMin can round up', function(assert) {
	var run = this.subject({timeSec : 2614});
  assert.strictEqual(run.get("timeMin"), "43.5667");
});

// timeHr
test('timeHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 14400});
 	assert.strictEqual(run.get("timeHr"), "4.0000");
});

test('timeHr can round down', function(assert) {
	var run = this.subject({timeSec : 14560});
  assert.strictEqual(run.get("timeHr"), "4.0444");
});

test('timeHr can round up', function(assert) {
	var run = this.subject({timeSec : 14860});
  assert.strictEqual(run.get("timeHr"), "4.1278");
});

// timeStackSec
test('timeStackSec property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 62});
 	assert.strictEqual(run.get("timeStackSec"), 2);
});

// timeStackMin
test('timeStackMin property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 145});
 	assert.strictEqual(run.get("timeStackMin"), 2);
});

// timeStackHr
test('timeStackHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 20000});
 	assert.strictEqual(run.get("timeStackHr"), 5);
});

// lengthMi
test('lengthMi property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1609.344});
 	assert.strictEqual(run.get("lengthMi"), "1.0000");
});

test('lengthMi has 4 digit precision and can round up', function(assert) {
	var run = this.subject({lenghtM : 12000});
 	assert.strictEqual(run.get("lengthMi"), "7.4565");
});

test('lengthMi can round down', function(assert) {
	var run = this.subject({lenghtM : 11550});
 	assert.strictEqual(run.get("lengthMi"), "7.1768");
});

// lengthMiStackMi
test('lengthMiStackMi property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1800});
 	assert.strictEqual(run.get("lengthMiStackMi"), 1);
});

// lengthMiStackDecimal
test('lengthMiStackDecimal property is calculated from lenghtM and can round up', function(assert) {
	var run = this.subject({lenghtM : 1712});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), 06);
});

test('lengthMiStackDecimal can round down', function(assert) {
	var run = this.subject({lenghtM : 1800});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), 12);
});

test('lengthMiStackDecimal can be zero', function(assert) {
	var run = this.subject({lenghtM : 1609.344});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), 0);
});

// lengthKm
test('lengthKm property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 2000});
 	assert.strictEqual(run.get("lengthKm"), "2.0000");
});

test('lengthKm has 4 digit precision and can round up', function(assert) {
	var run = this.subject({lenghtM : 1234.56});
 	assert.strictEqual(run.get("lengthKm"), "1.2346");
});

test('lengthKm can round down', function(assert) {
	var run = this.subject({lenghtM : 1234.52});
 	assert.strictEqual(run.get("lengthKm"), "1.2345");
});

// lengthKmStackKm
test('lengthKmStackKm property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1800});
 	assert.strictEqual(run.get("lengthKmStackKm"), 1);
});

// lengthKmStackDecimal
test('lengthKmStackDecimal property is calculated from lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1712});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "712");
});

test('lengthKmStackDecimal supports leading zero', function(assert) {
	var run = this.subject({lenghtM : 90});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "09");
});

test('lengthKmStackDecimal can be zero', function(assert) {
	var run = this.subject({lenghtM : 1000});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "0");
});

test('lengthKmStackDecimal setter changes lengthKmStackDecimal', function(assert) {
	var run = this.subject({lenghtM : 1000});
	run.set("lengthKmStackDecimal", "9");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "9");
});

test('lengthKmStackDecimal setter works with leading zeros', function(assert) {
	var run = this.subject({lenghtM : 1000});
	run.set("lengthKmStackDecimal", "09");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "09");
	run.set("lengthKmStackDecimal", "009");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "009");
});

test('lengthKmStackDecimal setter changes lenghtM', function(assert) {
	var run = this.subject({lenghtM : 1000});
	run.set("lengthKmStackDecimal", "09");
	assert.strictEqual(run.get("lenghtM"), 1090);
});


// helper methods
test('_getLeadingZerosFromString returns the amount of leading zeros a string has', function(assert) {
 	assert.strictEqual(this.subject()._getLeadingZerosFromString("0001"), 3);
 	assert.strictEqual(this.subject()._getLeadingZerosFromString("knkrdngkr"), 0);
});

test('_removeEndingZeros removes all zeros at the end of a string', function(assert) {
 	assert.strictEqual(this.subject()._removeEndingZeros("1000"), "1");
});

test('_removeEndingZeros removes all zeros at the end of a number', function(assert) {
 	assert.strictEqual(this.subject()._removeEndingZeros(1000), "1");
});

test('_removeEndingZeros returns an empty string if the parameter only contains zeros ', function(assert) {
	assert.strictEqual(this.subject()._removeEndingZeros(0), "");
 	assert.strictEqual(this.subject()._removeEndingZeros("0"), "");
 	assert.strictEqual(this.subject()._removeEndingZeros("000"), "");
});

// TODO: 
// check the type of every returned var
// add tests for setter
// add tets fot _helper methods as well