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

test('timeMin setter changes timeMin', function(assert) {
	var run = this.subject();
	run.set("timeMin", "100");
	assert.strictEqual(run.get("timeMin"), "100.0000");
});

test('timeMin setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("timeMin", "100.5");
	assert.strictEqual(run.get("timeMin"), "100.5000");
	run.set("timeMin", 50.5);
	assert.strictEqual(run.get("timeMin"), "50.5000");
});

test('timeMin setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("timeMin", 100);
	assert.strictEqual(run.get("timeMin"), "100.0000");
});

test('timeMin setter changes timeSec', function(assert) {
	var run = this.subject();
	run.set("timeMin", "12");
	assert.strictEqual(run.get("timeSec"), 720);
	run.set("timeMin", "12.123");
	assert.strictEqual(run.get("timeSec"), 727.38);
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

test('timeHr setter changes timeHr', function(assert) {
	var run = this.subject();
	run.set("timeHr", "2");
	assert.strictEqual(run.get("timeHr"), "2.0000");
});

test('timeHr setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("timeHr", "2.5");
	assert.strictEqual(run.get("timeHr"), "2.5000");
	run.set("timeHr", 2.5);
	assert.strictEqual(run.get("timeHr"), "2.5000");
});

test('timeHr setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("timeHr", 2);
	assert.strictEqual(run.get("timeHr"), "2.0000");
});

test('timeHr setter changes timeSec', function(assert) {
	var run = this.subject();
	run.set("timeHr", "2");
	assert.strictEqual(run.get("timeSec"), 7200);
	run.set("timeHr", "2.123");
	assert.strictEqual(run.get("timeSec"), 7642.8);
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

test('timeStackMin setter changes timeStackMin', function(assert) {
	var run = this.subject();
	run.set("timeStackMin", "10");
	assert.strictEqual(run.get("timeStackMin"), 10);
});

test('timeStackMin setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("timeStackMin", "2.2");
	assert.strictEqual(run.get("timeStackMin"), 2);
	run.set("timeStackMin", 2.5);
	assert.strictEqual(run.get("timeStackMin"), 3);
});

test('timeStackMin setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("timeStackMin", 2);
	assert.strictEqual(run.get("timeStackMin"), 2);
});

test('timeStackMin setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : 90}); // 1 minute, 30 seconds
	run.set("timeStackMin", "10"); // 10 minutes, 30 seconds
	assert.strictEqual(run.get("timeStackHr"), 0);
	assert.strictEqual(run.get("timeStackMin"), 10);
	assert.strictEqual(run.get("timeStackSec"), 30);
	assert.strictEqual(run.get("timeSec"), 630);
});

// timeStackHr
test('timeStackHr property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : 20000});
 	assert.strictEqual(run.get("timeStackHr"), 5);
});

test('timeStackHr setter changes timeStackHr', function(assert) {
	var run = this.subject();
	run.set("timeStackHr", "2");
	assert.strictEqual(run.get("timeStackHr"), 2);
});

test('timeStackHr setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("timeStackHr", "2.2");
	assert.strictEqual(run.get("timeStackHr"), 2);
	run.set("timeStackHr", 2.5);
	assert.strictEqual(run.get("timeStackHr"), 3);
});

test('timeStackHr setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("timeStackHr", 2);
	assert.strictEqual(run.get("timeStackHr"), 2);
});

test('timeStackHr setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : 12612}); // 3,5 hours and 12 seconds
	run.set("timeStackHr", "2"); // 2,5 hours and 12 seconds
	assert.strictEqual(run.get("timeStackHr"), 2);
	assert.strictEqual(run.get("timeStackMin"), 30);
	assert.strictEqual(run.get("timeStackSec"), 12);
	assert.strictEqual(run.get("timeSec"), 9012); 
});

// lengthMi
test('lengthMi property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : 1609.344});
 	assert.strictEqual(run.get("lengthMi"), "1.0000");
});

test('lengthMi has 4 digit precision and can round up', function(assert) {
	var run = this.subject({lengthM : 12000});
 	assert.strictEqual(run.get("lengthMi"), "7.4565");
});

test('lengthMi can round down', function(assert) {
	var run = this.subject({lengthM : 11550});
 	assert.strictEqual(run.get("lengthMi"), "7.1768");
});

test('lengthMi setter changes lengthMi', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "100");
	assert.strictEqual(run.get("lengthMi"), "100.0000");
});

test('lengthMi setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "100.55");
	assert.strictEqual(run.get("lengthMi"), "100.5500");
	run.set("lengthMi", 100.12);
	assert.strictEqual(run.get("lengthMi"), "100.1200");
});

test('lengthMi setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthMi", 100);
	assert.strictEqual(run.get("lengthMi"), "100.0000");
});

test('lengthMi setter changes lengthM', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "12");
	assert.strictEqual(run.get("lengthM"), 19312.128);
	run.set("lengthMi", "12.123");
	assert.strictEqual(run.get("lengthM"), 19510.077312);
});

// lengthMiStackMi
test('lengthMiStackMi property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : 1800});
 	assert.strictEqual(run.get("lengthMiStackMi"), 1);
});

test('lengthMiStackMi property can be zero', function(assert) {
	var run = this.subject({lengthM : 800});
 	assert.strictEqual(run.get("lengthMiStackMi"), 0);
});

test('lengthMiStackMi setter changes lengthMiStackMi', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", "2");
	assert.strictEqual(run.get("lengthMiStackMi"), 2);
});

test('lengthMiStackMi setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", "2.2");
	assert.strictEqual(run.get("lengthMiStackMi"), 2);
	run.set("lengthMiStackMi", 2.5);
	assert.strictEqual(run.get("lengthMiStackMi"), 3);
});

test('lengthMiStackMi setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", 2);
	assert.strictEqual(run.get("lengthMiStackMi"), 2);
});

test('lengthMiStackMi setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : 1234});
	run.set("lengthMiStackMi", "2");
	assert.strictEqual(run.get("lengthM"), 1234+3218.688);
});

// lengthMiStackDecimal
test('lengthMiStackDecimal property is calculated from lengthM and can round down', function(assert) {
	var run = this.subject({lengthM : 2711});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "68");
});

test('lengthMiStackDecimal can round up', function(assert) {
	var run = this.subject({lengthM : 2712});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "69");
});

test('lengthMiStackDecimal can have 1 digit', function(assert) {
	var run = this.subject({lengthM : 804.672});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "5");
});

test('lengthMiStackDecimal supports leading zero', function(assert) {
	var run = this.subject({lengthM : 100});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "06");
});

test('lengthMiStackDecimal can be zero', function(assert) {
	var run = this.subject({lengthM : 1609.344});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "0");
});

test('lengthMiStackDecimal setter changes lengthMiStackDecimal', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", "9");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "9");
});

test('lengthMiStackDecimal setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", "9.2");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "9");
	run.set("lengthMiStackDecimal", "9.5");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "1");
});

test('lengthMiStackDecimal setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", 9);
	assert.strictEqual(run.get("lengthMiStackDecimal"), "9");
});

test('lengthMiStackDecimal setter works with leading zeros', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", "09");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "09");
	run.set("lengthMiStackDecimal", "002");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "0");
	run.set("lengthMiStackDecimal", "009");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "01");
});

test('lengthMiStackDecimal setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : 2000}); // around 1.24 miles
	run.set("lengthMiStackDecimal", "09");
	assert.strictEqual(run.get("lengthM"), 1754.18496); // 1.09 miles
});

test('lengthMiStackDecimal and lengthMiStackDecimal setter will define lengthMi', function(assert) {
	var run = this.subject();
	run.setProperties({
		"lengthMiStackMi" : "12",
		"lengthMiStackDecimal" : "09"
	});
	assert.strictEqual(run.get("lengthMi"), "12.0900");
});

// lengthKm
test('lengthKm property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : 2000});
 	assert.strictEqual(run.get("lengthKm"), "2.0000");
});

test('lengthKm has 4 digit precision and can round up', function(assert) {
	var run = this.subject({lengthM : 1234.56});
 	assert.strictEqual(run.get("lengthKm"), "1.2346");
});

test('lengthKm can round down', function(assert) {
	var run = this.subject({lengthM : 1234.52});
 	assert.strictEqual(run.get("lengthKm"), "1.2345");
});

test('lengthKm setter changes lengthKm', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "100");
	assert.strictEqual(run.get("lengthKm"), "100.0000");
});

test('lengthKm setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "100.12345");
	assert.strictEqual(run.get("lengthKm"), "100.1235");
	run.set("lengthKm", 100.34);
	assert.strictEqual(run.get("lengthKm"), "100.3400");
});

test('lengthKm setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthKm", 100);
	assert.strictEqual(run.get("lengthKm"), "100.0000");
});

test('lengthKm setter changes lengthM', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "12");
	assert.strictEqual(run.get("lengthM"), 12000);
	run.set("lengthKm", "12.123");
	assert.strictEqual(run.get("lengthM"), 12123);
});

// lengthKmStackKm
test('lengthKmStackKm property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : 1800});
 	assert.strictEqual(run.get("lengthKmStackKm"), 1);
});

test('lengthKmStackKm property canbe zero', function(assert) {
	var run = this.subject({lengthM : 12});
 	assert.strictEqual(run.get("lengthKmStackKm"), 0);
});

test('lengthKmStackKm setter changes lengthKmStackKm', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", "2");
	assert.strictEqual(run.get("lengthKmStackKm"), 2);
});

test('lengthKmStackKm setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", "2.9");
	assert.strictEqual(run.get("lengthKmStackKm"), 3);
	run.set("lengthKmStackKm", 2.3);
	assert.strictEqual(run.get("lengthKmStackKm"), 2);
});

test('lengthKmStackKm setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", 2);
	assert.strictEqual(run.get("lengthKmStackKm"), 2);
});

test('lengthKmStackKm setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : 1234});
	run.set("lengthKmStackKm", "2");
	assert.strictEqual(run.get("lengthM"), 2234);
});

// lengthKmStackDecimal
test('lengthKmStackDecimal property is calculated from lengthM and can round down', function(assert) {
	var run = this.subject({lengthM : 1712});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "71");
});

test('lengthKmStackDecimal property can round up', function(assert) {
	var run = this.subject({lengthM : 1719});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "72");
});

test('lengthKmStackDecimal can have 1 digit', function(assert) {
	var run = this.subject({lengthM : 500});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "5");
});

test('lengthKmStackDecimal supports leading zero', function(assert) {
	var run = this.subject({lengthM : 90});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "09");
});

test('lengthKmStackDecimal can be zero', function(assert) {
	var run = this.subject({lengthM : 1000});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "0");
});

test('lengthKmStackDecimal setter changes lengthKmStackDecimal', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackDecimal", "9");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "9");
});

test('lengthKmStackDecimal setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackDecimal", 9);
	assert.strictEqual(run.get("lengthKmStackDecimal"), "9");
});

test('lengthKmStackDecimal setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackDecimal", 8.2);
	assert.strictEqual(run.get("lengthKmStackDecimal"), "8");
	run.set("lengthKmStackDecimal", 9.5);
	assert.strictEqual(run.get("lengthKmStackDecimal"), "1");
});

test('lengthKmStackDecimal setter works with leading zeros', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackDecimal", "09");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "09");
	run.set("lengthKmStackDecimal", "002");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "0");
	run.set("lengthKmStackDecimal", "009");
	assert.strictEqual(run.get("lengthKmStackDecimal"), "01");
});

test('lengthKmStackDecimal setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : 1000});
	run.set("lengthKmStackDecimal", "09");
	assert.strictEqual(run.get("lengthM"), 1090);
});

test('lengthKmStackKm and lengthKmStackDecimal setter will define lengthKm', function(assert) {
	var run = this.subject();
	run.setProperties({
		"lengthKmStackKm" : "12",
		"lengthKmStackDecimal" : "09"
	});
	assert.strictEqual(run.get("lengthKm"), "12.0900");
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