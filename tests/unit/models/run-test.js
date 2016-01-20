import DS from 'ember-data';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('run', 'Run Model');

test('run is a valid ember data Model', function(assert) {
  var run = this.subject();
  assert.ok(run);
  assert.ok(run instanceof DS.Model);
});

// timeHr
test('timeHr property is calculated from timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(14400)});
  assert.strictEqual(run.get("timeHr").toString(), "4");
});

test('timeHr can have up to 20 decimal places', function(assert) {
  var run = this.subject({timeSec : new BigNumber(14560)});
  assert.strictEqual(run.get("timeHr").toString(), "4.04444444444444444444");
});

test('timeHr setter changes timeHr', function(assert) {
  var run = this.subject();
  run.set("timeHr", "2");
  assert.strictEqual(run.get("timeHr").toString(), "2");
});

test('timeHr setter can handle floats', function(assert) {
  var run = this.subject();
  run.set("timeHr", "2.5");
  assert.strictEqual(run.get("timeHr").toString(), "2.5");
  run.set("timeHr", 2.3);
  assert.strictEqual(run.get("timeHr").toString(), "2.3");
});

test('timeHr setter also works with integer', function(assert) {
  var run = this.subject();
  run.set("timeHr", 2);
  assert.strictEqual(run.get("timeHr").toString(), "2");
});

test('timeHr setter changes timeSec', function(assert) {
  var run = this.subject();
  run.set("timeHr", "2");
  assert.strictEqual(run.get("timeSec").toString(), "7200");
  run.set("timeHr", "2.123");
  assert.strictEqual(run.get("timeSec").toString(), "7642.8");
});

// timeMin
test('timeMin property is calculated from timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600)});
  assert.strictEqual(run.get("timeMin").toString(), "60");
});

test('timeMin can have up to 20 decimal places', function(assert) {
  var run = this.subject({timeSec : new BigNumber(2612)});
  assert.strictEqual(run.get("timeMin").toString(), "43.53333333333333333333");
});

test('timeMin setter changes timeMin', function(assert) {
  var run = this.subject();
  run.set("timeMin", "100");
  assert.strictEqual(run.get("timeMin").toString(), "100");
});

test('timeMin setter can handle floats', function(assert) {
  var run = this.subject();
  run.set("timeMin", "100.5");
  assert.strictEqual(run.get("timeMin").toString(), "100.5");
  run.set("timeMin", 50.5);
  assert.strictEqual(run.get("timeMin").toString(), "50.5");
});

test('timeMin setter also works with integer', function(assert) {
  var run = this.subject();
  run.set("timeMin", 100);
  assert.strictEqual(run.get("timeMin").toString(), "100");
});

test('timeMin setter changes timeSec', function(assert) {
  var run = this.subject();
  run.set("timeMin", "12");
  assert.strictEqual(run.get("timeSec").toString(), "720");
  run.set("timeMin", "12.123");
  assert.strictEqual(run.get("timeSec").toString(), "727.38");
});

// timeStackHr
test('timeStackHr property is calculated from timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(20000)});
  assert.strictEqual(run.get("timeStackHr").toString(), "5");
});

test('timeStackHr property can be zero', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3599)});
  assert.strictEqual(run.get("timeStackHr").toString(), "0");
});

test('timeStackHr setter changes timeStackHr', function(assert) {
  var run = this.subject();
  run.set("timeStackHr", "2");
  assert.strictEqual(run.get("timeStackHr").toString(), "2");
});

test('timeStackHr setter can handle floats', function(assert) {
  var run = this.subject();
  run.set("timeStackHr", "2.2");
  assert.strictEqual(run.get("timeStackHr").toString(), "2");
  run.set("timeStackHr", 2.5);
  assert.strictEqual(run.get("timeStackHr").toString(), "3");
});

test('timeStackHr setter also works with integer', function(assert) {
  var run = this.subject();
  run.set("timeStackHr", 2);
  assert.strictEqual(run.get("timeStackHr").toString(), "2");
});

test('timeStackHr setter influences all time related properties', function(assert) {
  var run = this.subject({timeSec : new BigNumber(12612)}); // 3,5 hours and 12 seconds
  run.set("timeStackHr", "2"); // 2,5 hours and 12 seconds
  assert.strictEqual(run.get("timeStackHr").toString(), "2");
  assert.strictEqual(run.get("timeStackMin").toString(), "30");
  assert.strictEqual(run.get("timeStackSec").toString(), "12");
  assert.strictEqual(run.get("timeSec").toString(), "9012");
});

// timeStackMin
test('timeStackMin property is calculated from timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(145)});
  assert.strictEqual(run.get("timeStackMin").toString(), "2");
});

test('timeStackMin property can be zero', function(assert) {
  var run = this.subject({timeSec : new BigNumber(59)});
  assert.strictEqual(run.get("timeStackMin").toString(), "0");
});

test('timeStackMin setter changes timeStackMin', function(assert) {
  var run = this.subject();
  run.set("timeStackMin", "10");
  assert.strictEqual(run.get("timeStackMin").toString(), "10");
});

test('timeStackMin setter can handle floats', function(assert) {
  var run = this.subject();
  run.set("timeStackMin", "2.2");
  assert.strictEqual(run.get("timeStackMin").toString(), "2");
  run.set("timeStackMin", 2.5);
  assert.strictEqual(run.get("timeStackMin").toString(), "3");
});

test('timeStackMin setter also works with integer', function(assert) {
  var run = this.subject();
  run.set("timeStackMin", 2);
  assert.strictEqual(run.get("timeStackMin").toString(), "2");
});

test('timeStackMin setter influences all time related properties', function(assert) {
	var run = this.subject({timeSec : new BigNumber(90)}); // 1 minute, 30 seconds
	run.set("timeStackMin", "10"); // 10 minutes, 30 seconds
	assert.strictEqual(run.get("timeStackHr").toString(), "0");
	assert.strictEqual(run.get("timeStackMin").toString(), "10");
	assert.strictEqual(run.get("timeStackSec").toString(), "30");
	assert.strictEqual(run.get("timeSec").toString(), "630");
});

// timeStackSec
test('timeStackSec property is calculated from timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(62)});
 	assert.strictEqual(run.get("timeStackSec").toString(), "2");
});

test('timeStackSec property can be zero', function(assert) {
	var run = this.subject({timeSec : new BigNumber(60)});
 	assert.strictEqual(run.get("timeStackSec").toString(), "0");
});

test('timeStackSec setter changes timeStackSec', function(assert) {
	var run = this.subject();
	run.set("timeStackSec", "10");
	assert.strictEqual(run.get("timeStackSec").toString(), "10");
});

test('timeStackSec setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("timeStackSec", "2.2");
	assert.strictEqual(run.get("timeStackSec").toString(), "2");
	run.set("timeStackSec", 2.5);
	assert.strictEqual(run.get("timeStackSec").toString(), "3");
});

test('timeStackSec setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("timeStackSec", 2);
	assert.strictEqual(run.get("timeStackSec").toString(), "2");
});

test('timeStackSec setter influences all time related properties', function(assert) {
	var run = this.subject({timeSec : new BigNumber(12612)}); // 3,5 hours and 12 seconds
	run.set("timeStackSec", "20"); // 3,5 hours and 20 seconds
	assert.strictEqual(run.get("timeStackHr").toString(), "3");
	assert.strictEqual(run.get("timeStackMin").toString(), "30");
	assert.strictEqual(run.get("timeStackSec").toString(), "20");
	assert.strictEqual(run.get("timeSec").toString(), "12620");
});

test('timeStackSec setter handles values bigger than 59', function(assert) {
	var run = this.subject({timeSec : new BigNumber(12612)}); // 3,5 hours and 12 seconds
	run.set("timeStackSec", "62"); // 3,5 hours and 62 seconds
	assert.strictEqual(run.get("timeStackHr").toString(), "3");
	assert.strictEqual(run.get("timeStackMin").toString(), "31"); // 30 flips to 31 because 62 seconds starts another minute
	assert.strictEqual(run.get("timeStackSec").toString(), "2");
	assert.strictEqual(run.get("timeSec").toString(), "12662");
});

// lengthKm
test('lengthKm property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
 	assert.strictEqual(run.get("lengthKm").toString(), "2");
});

test('lengthKm can have up to 20 decimal places and can round up', function(assert) {
  // BigNumber can only be initialized with 15 digit, dividing it will result in more digits
	var run = this.subject({lengthM : new BigNumber("9.12345678901234").dividedBy(6)});
  // http://keisan.casio.com/calculator results in 0.0015205761315020566666666667
 	assert.strictEqual(run.get("lengthKm").toString(), "0.00152057613150205667");

  run.setProperties({lengthM : new BigNumber("8.78748598595").dividedBy(3)});
  // http://keisan.casio.com/calculator results in 0.0029291619953166666666666667
  assert.strictEqual(run.get("lengthKm").toString(), "0.00292916199531666667");

  run.setProperties({lengthM : new BigNumber("8.123455").dividedBy(7)});
  // http://keisan.casio.com/calculator results in 0.0011604935714285714285714286
  assert.strictEqual(run.get("lengthKm").toString(), "0.00116049357142857143");
});

test('lengthKm can round down', function(assert) {
  // BigNumber can only be initialized with 15 digit, dividing it will result in more digits
  var run = this.subject({lengthM : new BigNumber("9.12345678901234").dividedBy(9)});
	// http://keisan.casio.com/calculator results in 0.001013717421001371111111

 	run.setProperties({lengthM : new BigNumber("9.3343442341212212212").dividedBy(5)});
  // http://keisan.casio.com/calculator results in 0.00186686884682424424424
  assert.strictEqual(run.get("lengthKm").toString(), "0.00186686884682424424");

  run.setProperties({lengthM : new BigNumber("9.3343442341214223423324212").dividedBy(3)});
  // http://keisan.casio.com/calculator results in 0.0031114480780404741141108071
  assert.strictEqual(run.get("lengthKm").toString(), "0.00311144807804047411");
});

test('lengthKm setter changes lengthKm', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "100");
	assert.strictEqual(run.get("lengthKm").toString(), "100");
});

test('lengthKm setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "100.12345");
	assert.strictEqual(run.get("lengthKm").toString(), "100.12345");
	run.set("lengthKm", 100.34);
	assert.strictEqual(run.get("lengthKm").toString(), "100.34");
});

test('lengthKm setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthKm", 100);
	assert.strictEqual(run.get("lengthKm").toString(), "100");
});

test('lengthKm setter changes lengthM', function(assert) {
	var run = this.subject();
	run.set("lengthKm", "12");
	assert.strictEqual(run.get("lengthM").toString(), "12000");
	run.set("lengthKm", "12.123");
	assert.strictEqual(run.get("lengthM").toString(), "12123");
});

// lengthKmStackKm
test('lengthKmStackKm property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1800)});
 	assert.strictEqual(run.get("lengthKmStackKm").toString(), "1");
});

test('lengthKmStackKm property can be zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(12)});
 	assert.strictEqual(run.get("lengthKmStackKm").toString(), "0");
});

test('lengthKmStackKm setter changes lengthKmStackKm', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", "2");
	assert.strictEqual(run.get("lengthKmStackKm").toString(), "2");
});

test('lengthKmStackKm setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", "2.9");
	assert.strictEqual(run.get("lengthKmStackKm").toString(), "3");
	run.set("lengthKmStackKm", 2.3);
	assert.strictEqual(run.get("lengthKmStackKm").toString(), "2");
});

test('lengthKmStackKm setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthKmStackKm", 2);
	assert.strictEqual(run.get("lengthKmStackKm").toString(), "2");
});

test('lengthKmStackKm setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1234)});
	run.set("lengthKmStackKm", "2");
	assert.strictEqual(run.get("lengthM").toString(), "2234");
});

// lengthKmStackDecimal
test('lengthKmStackDecimal property is calculated from lengthM and can round down', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1712)});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "71");
});

test('lengthKmStackDecimal property can round up', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1719)});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "72");
});

test('lengthKmStackDecimal can have 1 digit', function(assert) {
	var run = this.subject({lengthM : new BigNumber(500)});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "5");
});

test('lengthKmStackDecimal supports leading zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(90)});
 	assert.strictEqual(run.get("lengthKmStackDecimal"), "09");
});

test('lengthKmStackDecimal can be zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1000)});
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
	run.set("lengthKmStackDecimal", "8.2");
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
	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("lengthKmStackDecimal", "09");
	assert.strictEqual(run.get("lengthM").toString(), "1090");
});

test('lengthKmStackKm and lengthKmStackDecimal setter will define lengthKm', function(assert) {
	var run = this.subject();
	run.setProperties({
		"lengthKmStackKm" : "12",
		"lengthKmStackDecimal" : "09"
	});
	assert.strictEqual(run.get("lengthKm").toString(), "12.09");
});

// lengthMi
test('lengthMi property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1609.344)});
 	assert.strictEqual(run.get("lengthMi").toString(), "1");
});

test('lengthMi can have up to 20 decimal places and can round up', function(assert) {
	var run = this.subject({lengthM : new BigNumber(9.12345678901235)});
  // http://keisan.casio.com/calculator results in 0.0056690532223144026385906307
 	assert.strictEqual(run.get("lengthMi").toString(), "0.00566905322231440264");

  run.setProperties({lengthM : new BigNumber(14232.25)});
  // http://keisan.casio.com/calculator results in 8.8435101507197963890877277
  assert.strictEqual(run.get("lengthMi").toString(), "8.84351015071979638909");

  run.setProperties({lengthM : new BigNumber(123.45)});
  // http://keisan.casio.com/calculator results in 0.07670827368169887854927225
  assert.strictEqual(run.get("lengthMi").toString(), "0.07670827368169887855");
});

test('lengthMi can round down', function(assert) {
	var run = this.subject({lengthM : new BigNumber(9.12345678901234)});
  // http://keisan.casio.com/calculator results in 0.005669053222314396424879
 	assert.strictEqual(run.get("lengthMi").toString(), "0.00566905322231439642");

  run.setProperties({lengthM : new BigNumber(123)});
  // http://keisan.casio.com/calculator results in 0.076428656645192078262944405
  assert.strictEqual(run.get("lengthMi").toString(), "0.07642865664519207826");

  run.setProperties({lengthM : new BigNumber(12.12)});
  // http://keisan.casio.com/calculator results in 0.0075310188499164877117633023
  assert.strictEqual(run.get("lengthMi").toString(), "0.00753101884991648771");
});

test('lengthMi setter changes lengthMi', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "100");
	assert.strictEqual(run.get("lengthMi").toString(), "100");
});

test('lengthMi setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "100.55");
	assert.strictEqual(run.get("lengthMi").toString(), "100.55");
	run.set("lengthMi", 100.12);
	assert.strictEqual(run.get("lengthMi").toString(), "100.12");
});

test('lengthMi setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthMi", 100);
	assert.strictEqual(run.get("lengthMi").toString(), "100");
});

test('lengthMi setter changes lengthM', function(assert) {
	var run = this.subject();
	run.set("lengthMi", "12");
	assert.strictEqual(run.get("lengthM").toString(), "19312.128");
	run.set("lengthMi", "12.123");
	assert.strictEqual(run.get("lengthM").toString(), "19510.077312");
});

// lengthMiStackMi
test('lengthMiStackMi property is calculated from lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1800)});
 	assert.strictEqual(run.get("lengthMiStackMi").toString(), "1");
});

test('lengthMiStackMi property can be zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(800)});
 	assert.strictEqual(run.get("lengthMiStackMi").toString(), "0");
});

test('lengthMiStackMi setter changes lengthMiStackMi', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", "2");
	assert.strictEqual(run.get("lengthMiStackMi").toString(), "2");
});

test('lengthMiStackMi setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", "2.2");
	assert.strictEqual(run.get("lengthMiStackMi").toString(), "2");
	run.set("lengthMiStackMi", 2.5);
	assert.strictEqual(run.get("lengthMiStackMi").toString(), "3");
});

test('lengthMiStackMi setter also works with integer', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackMi", 2);
	assert.strictEqual(run.get("lengthMiStackMi").toString(), "2");
});

test('lengthMiStackMi setter changes lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1234)});
	run.set("lengthMiStackMi", "2");
	assert.strictEqual(run.get("lengthM").toString(), "4452.688");
});

// lengthMiStackDecimal
test('lengthMiStackDecimal property is calculated from lengthM and can round down', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2711)});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "68");
});

test('lengthMiStackDecimal can round up', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2712)});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "69");
});

test('lengthMiStackDecimal can have 1 digit', function(assert) {
	var run = this.subject({lengthM : new BigNumber(804.672)});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "5");
});

test('lengthMiStackDecimal supports leading zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(100)});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "06");
});

test('lengthMiStackDecimal can be zero', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1609.344)});
 	assert.strictEqual(run.get("lengthMiStackDecimal"), "0");
});

test('lengthMiStackDecimal setter changes lengthMiStackDecimal', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", "9");
	assert.strictEqual(run.get("lengthMiStackDecimal"), "9");
});

test('lengthMiStackDecimal setter can handle floats', function(assert) {
	var run = this.subject();
	run.set("lengthMiStackDecimal", 9.2);
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
	var run = this.subject({lengthM : new BigNumber(2000)}); // around 1.24 miles
	run.set("lengthMiStackDecimal", "09");
	assert.strictEqual(run.get("lengthM").toString(), "1754.18496"); // 1.09 miles
});

test('lengthMiStackDecimal and lengthMiStackDecimal setter will define lengthMi', function(assert) {
	var run = this.subject();
	run.setProperties({
		"lengthMiStackMi" : "12",
		"lengthMiStackDecimal" : "09"
	});
	assert.strictEqual(run.get("lengthMi").toString(), "12.09");
});

// paceMinPerKm
test('paceMinPerKm property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeMin : new BigNumber(60), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("paceMinPerKm").toString(), "60");
});

test('paceMinPerKm can have up to 20 decimal places and can round up', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.1234567891238), lengthM : new BigNumber(900)});
  // http://keisan.casio.com/calculator results in 1.2482853212486666666666667
 	assert.strictEqual(run.get("paceMinPerKm").toString(), "1.24828532124866666667");

  run.setProperties({timeMin : new BigNumber(2.9090), lengthM : new BigNumber(93)});
  // http://keisan.casio.com/calculator results in 31.279569892473118279569892
  assert.strictEqual(run.get("paceMinPerKm").toString(), "31.27956989247311827957");

  run.setProperties({timeMin : new BigNumber(2.9090), lengthM : new BigNumber(123)});
  // http://keisan.casio.com/calculator results in 23.650406504065040650406504
  assert.strictEqual(run.get("paceMinPerKm").toString(), "23.65040650406504065041");
});

test('paceMinPerKm can round down', function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.1234567891234), lengthM : new BigNumber(900)});
  // http://keisan.casio.com/calculator results in 1.248285321248222222222
 	assert.strictEqual(run.get("paceMinPerKm").toString(), "1.24828532124822222222");

  run.setProperties({timeMin : new BigNumber(2.1234567891238), lengthM : new BigNumber(921)});
  // http://keisan.casio.com/calculator results in 2.3055991195698154180238871
  assert.strictEqual(run.get("paceMinPerKm").toString(), "2.30559911956981541802");

  run.setProperties({timeMin : new BigNumber(2.12345678238), lengthM : new BigNumber(123)});
  // http://keisan.casio.com/calculator results in 17.26387627951219512195122
  assert.strictEqual(run.get("paceMinPerKm").toString(), "17.26387627951219512195");
});

test('paceMinPerKm setter changes paceMinPerKm', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerKm", "21");
	assert.strictEqual(run.get("paceMinPerKm").toString(), "21");
});

test('paceMinPerKm setter also works with integer', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerKm", 21);
	assert.strictEqual(run.get("paceMinPerKm").toString(), "21");
});

test('paceMinPerKm setter can handle floats', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerKm", 2.2);
	assert.strictEqual(run.get("paceMinPerKm").toString(), "2.2");
	run.set("paceMinPerKm", "2.5");
	assert.strictEqual(run.get("paceMinPerKm").toString(), "2.5");
	run.set("paceMinPerKm", 2.21234);
	assert.strictEqual(run.get("paceMinPerKm").toString(), "2.21234");
});

test('paceMinPerKm setter changes timeSec', function(assert) {
	var run = this.subject({lengthM : new BigNumber(8000)});
	run.set("paceMinPerKm", "2");
	assert.strictEqual(run.get("timeSec").toString(), "960"); // 8km with 2min/km will take 16 min (960 sek)
});

test('paceMinPerKm setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerKm", 21);
	assert.strictEqual(run.get("lengthM").toString(), "2000");
});

// paceMinPerKmStackMin
test('paceMinPerKmStackMin property is calculated from lengthM', function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.23454), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "1");
});

test('paceMinPerKmStackMin property can be zero', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1), lengthM : new BigNumber(1001)});
 	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "0");
});

test('paceMinPerKmStackMin setter changes paceMinPerKmStackMin', function(assert) {
	var run = this.subject({timeSec : new BigNumber(270), lengthM : new BigNumber(2000)});
	run.set("paceMinPerKmStackMin", "12");
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "12");
});

test('paceMinPerKmStackMin setter can handle floats', function(assert) {
	var run = this.subject({timeSec : new BigNumber(270), lengthM : new BigNumber(2000)});
	run.set("paceMinPerKmStackMin", "5.5");
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "6");
	run.set("paceMinPerKmStackMin", 2.3);
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "2");
});

test('paceMinPerKmStackMin setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(270), lengthM : new BigNumber(2000)});
	run.set("paceMinPerKmStackMin", 12);
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "12");
});

test('paceMinPerKmStackMin setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(60), lengthM : new BigNumber(2000)});
	run.set("paceMinPerKmStackMin", "2");
	assert.strictEqual(run.get("timeSec").toString(), "300"); // 2km with 2,5min/km will take 5 minutes (300 sek)
});

test('paceMinPerKmStackMin setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(270), lengthM : new BigNumber(2000)});
	run.set("paceMinPerKmStackMin", 12);
	assert.strictEqual(run.get("lengthM").toString(), "2000");
});

// paceMinPerKmStackSec
test('paceMinPerKmStackSec property is calculated from timeMin and lengthM and can round down' , function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.54), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "32"); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerKmStackSec property can round up' , function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.56), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "34"); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerKmStackSec can be zero', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "0");
});

test('paceMinPerKmStackSec setter changes paceMinPerKmStackSec', function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.5), lengthM : new BigNumber(1000)});
	run.set("paceMinPerKmStackSec", "10");
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "10");
});

test('paceMinPerKmStackSec setter can handle floats', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.5), lengthM : new BigNumber(1000)});
	run.set("paceMinPerKmStackSec", "2.2");
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "2");
	run.set("paceMinPerKmStackSec", 2.5);
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "3");
});

test('paceMinPerKmStackSec setter also works with integer', function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.5), lengthM : new BigNumber(1000)});
	run.set("paceMinPerKmStackSec", 2);
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "2");
});

test('paceMinPerKmStackSec setter influences all pace related properties', function(assert) {
  var run = this.subject({timeMin : new BigNumber(12), lengthM : new BigNumber(2000)}); // 6 min/km
  run.set("paceMinPerKmStackSec", "20"); // 6.3333 min/km
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "6");
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "20");
	assert.strictEqual(run.get("paceMinPerKm").toString(), "6.33333333333333333333");
});

test('paceMinPerKmStackSec setter handles values bigger than 59', function(assert) {
  var run = this.subject({timeMin : new BigNumber(12), lengthM : new BigNumber(2000)}); // 6 min/km
	run.set("paceMinPerKmStackSec", "90"); // 7.5000 min/km
	assert.strictEqual(run.get("paceMinPerKmStackMin").toString(), "7"); // 6 flips to 7 because a paceMinPerKmStackSec of 90 flips the paceMinPerKmStackMin
	assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "30");
	assert.strictEqual(run.get("paceMinPerKm").toString(), "7.5");
});

test('paceMinPerKmStackSec setter should refer to an uncompressed version paceMinPerKmStackSec (with digits) to have exact results', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600*4), lengthM : new BigNumber(42195)});
  // paceMinPerKmStackSec is calculated from the previous paceMinPerKmStackSec
  // Since this value is normally rounded, it should be used in uncompressed form for calculation

  // In this example paceMinPerKm is currently 5.68787771062922147174
  assert.strictEqual(run.get("paceMinPerKm").toString(), "5.68787771062922147174");

  // which results in a paceMinPerKmStackSec of 41
  assert.strictEqual(run.get("paceMinPerKmStackSec").toString(), "41");

  // actually it is 41,272662638 (0.68787771062922147174*60)
  // when setting paceMinPerKmStackSec
  run.set("paceMinPerKmStackSec", "0");
  // it should refer to 41,272662638 and not 41 to result in 5 (aka 5.00) instead of 5.00454437729588813841
  assert.strictEqual(run.get("paceMinPerKm").toString(), "5");
});

// paceMinPerMi
test('paceMinPerMi property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeMin : new BigNumber(60), lengthM : new BigNumber(1609.344)});
 	assert.strictEqual(run.get("paceMinPerMi").toString(), "60");
});

test('paceMinPerMi can have up to 20 decimal places and can round up', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.1234567891238), lengthMi : new BigNumber(900)});
  // http://keisan.casio.com/calculator results in 0.0012482853212486666666666667
 	assert.strictEqual(run.get("paceMinPerMi").toString(), "0.00124828532124866667");

  run.setProperties({timeMin : new BigNumber(1.1234567891238), lengthMi : new BigNumber(123)});
  // http://keisan.casio.com/calculator results in 0.001248285321248666666667
  assert.strictEqual(run.get("paceMinPerMi").toString(), "0.00913379503352682927");

  run.setProperties({timeMin : new BigNumber(13), lengthMi : new BigNumber(124)});
  // http://keisan.casio.com/calculator results in 0.10483870967741935483870968
  assert.strictEqual(run.get("paceMinPerMi").toString(), "0.10483870967741935484");
});

test('paceMinPerMi can round down', function(assert) {
	var run = this.subject({timeMin : new BigNumber(3.1131567891211), lengthMi : new BigNumber(900)});
  // http://keisan.casio.com/calculator results in 0.0034590630990234444444444444
  assert.strictEqual(run.get("paceMinPerMi").toString(), "0.00345906309902344444");

  run.setProperties({timeMin : new BigNumber(9), lengthMi : new BigNumber(124)});
  // http://keisan.casio.com/calculator results in 0.072580645161290322580645161
  assert.strictEqual(run.get("paceMinPerMi").toString(), "0.07258064516129032258");

  run.setProperties({timeMin : new BigNumber(1245), lengthMi : new BigNumber(124)});
  // http://keisan.casio.com/calculator results in 10.04032258064516129032 2581
  assert.strictEqual(run.get("paceMinPerMi").toString(), "10.04032258064516129032");
});

test('paceMinPerMi setter changes paceMinPerMi', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerMi", "21");
	assert.strictEqual(run.get("paceMinPerMi").toString(), "21");
});

test('paceMinPerMi setter also works with integer', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerMi", 21);
	assert.strictEqual(run.get("paceMinPerMi").toString(), "21");
});

test('paceMinPerMi setter can handle floats', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerMi", 2.2);
	assert.strictEqual(run.get("paceMinPerMi").toString(), "2.2");
	run.set("paceMinPerMi", "2.5");
	assert.strictEqual(run.get("paceMinPerMi").toString(), "2.5");
	run.set("paceMinPerMi", 2.21234);
	assert.strictEqual(run.get("paceMinPerMi").toString(), "2.21234");
});

test('paceMinPerMi setter changes timeSec', function(assert) {
	var run = this.subject({lengthMi : new BigNumber(8)});
	run.set("paceMinPerMi", "2");
	assert.strictEqual(run.get("timeSec").toString(), "960"); // 8mi with 2min/mi will take 16 min (960 sek)
});

test('paceMinPerMi setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({lengthM : new BigNumber(2000)});
	run.set("paceMinPerMi", 21);
	assert.strictEqual(run.get("lengthM").toString(), "2000");
});

// paceMinPerMiStackMin
test('paceMinPerMiStackMin property is calculated from lengthM', function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.23454), lengthMi : new BigNumber(1)});
 	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "1");
});

test('paceMinPerMiStackMin property can be zero', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1), lengthMi : new BigNumber(1.1)});
 	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "0");
});

test('paceMinPerMiStackMin setter changes paceMinPerMiStackMin', function(assert) {
  var run = this.subject({timeSec : new BigNumber(270), lengthMi : new BigNumber(2)});
	run.set("paceMinPerMiStackMin", "12");
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "12");
});

test('paceMinPerMiStackMin setter can handle floats', function(assert) {
  var run = this.subject({timeSec : new BigNumber(270), lengthMi : new BigNumber(2)});
	run.set("paceMinPerMiStackMin", "5.5");
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "6");
	run.set("paceMinPerMiStackMin", 2.3);
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "2");
});

test('paceMinPerMiStackMin setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(270), lengthMi : new BigNumber(2)});
	run.set("paceMinPerMiStackMin", 12);
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "12");
});

test('paceMinPerMiStackMin setter changes timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(60), lengthMi : new BigNumber(2)});
	run.set("paceMinPerMiStackMin", "2");
	assert.strictEqual(run.get("timeSec").toString(), "300"); // 2mi with 2,5min/km will take 5 minutes (300 sek)
});

test('paceMinPerMiStackMin setter doesn\'t change lengthM', function(assert) {
  var run = this.subject({timeSec : new BigNumber(270), lengthM : new BigNumber(2000)});
	run.set("paceMinPerMiStackMin", 12);
	assert.strictEqual(run.get("lengthM").toString(), "2000");
});

// paceMinPerMiStackSec
test('paceMinPerMiStackSec property is calculated from timeMin and lengthM and can round down' , function(assert) {
	var run = this.subject({timeMin : new BigNumber(1.54), lengthM : new BigNumber(1609.344)});
 	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "32"); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerMiStackSec property can round up' , function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.56), lengthM : new BigNumber(1609.344)});
 	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "34"); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerMiStackSec can be zero', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1), lengthMi : new BigNumber(1)});
 	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "0");
});

test('paceMinPerMiStackSec setter changes paceMinPerMiStackSec', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.5), lengthMi : new BigNumber(1)});
	run.set("paceMinPerMiStackSec", "10");
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "10");
});

test('paceMinPerMiStackSec setter can handle floats', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.5), lengthMi : new BigNumber(1)});
	run.set("paceMinPerMiStackSec", "2.2");
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "2");
	run.set("paceMinPerMiStackSec", 2.5);
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "3");
});

test('paceMinPerMiStackSec setter also works with integer', function(assert) {
  var run = this.subject({timeMin : new BigNumber(1.5), lengthM : new BigNumber(1000)});
	run.set("paceMinPerMiStackSec", 2);
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "2");
});

test('paceMinPerMiStackSec setter influences all pace related properties', function(assert) {
  var run = this.subject({timeMin : new BigNumber(12), lengthMi : new BigNumber(2)});  // 6 min/mi
	run.set("paceMinPerMiStackSec", "20"); // 6.3333 min/km
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "6");
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "20");
	assert.strictEqual(run.get("paceMinPerMi").toString(), "6.33333333333333333333");
});

test('paceMinPerMiStackSec setter handles values bigger than 59', function(assert) {
  var run = this.subject({timeMin : new BigNumber(12), lengthMi : new BigNumber(2)});  // 6 min/mi
	run.set("paceMinPerMiStackSec", "90"); // 7.5 min/km
	assert.strictEqual(run.get("paceMinPerMiStackMin").toString(), "7"); // 6 flips to 7 because a paceMinPerMiStackSec of 90 flips the paceMinPerMiStackMin
	assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "30");
	assert.strictEqual(run.get("paceMinPerMi").toString(), "7.5");
});

test('paceMinPerMiStackSec setter should refer to an uncompressed version paceMinPerMiStackSec (with digits) to have exact results', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600*4), lengthM : new BigNumber(42195)});
  // paceMinPerMiStackSec is calculated from the previous paceMinPerMiStackSec
  // Since this value is normally rounded, it should be used in uncompressed form for calculation

  // In this example paceMinPerMi is currently 9.15375186633487380021
  assert.strictEqual(run.get("paceMinPerMi").toString(), "9.15375186633487380021");

  // which results in a paceMinPerMiStackSec of 09
  assert.strictEqual(run.get("paceMinPerMiStackSec").toString(), "9");

  // actually it is 9.2251119800924280126 (0.15375186633487380021*60)
  // when setting paceMinPerMiStackSec
  run.set("paceMinPerMiStackSec", "0");
  // it should refer to 9.2251119800924280126 and not 9 to result in 9 (aka 9.00) instead of 9.00375186633487380021
  assert.strictEqual(run.get("paceMinPerMi").toString(), "9");
});

// speedKmHr
test('speedKmHr property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(1500)});
  assert.strictEqual(run.get("speedKmHr").toString(), "0.75");
});

test('speedKmHr can have up to 20 decimal places and can round up', function(assert) {
  var run = this.subject({timeSec : new BigNumber(11), lengthM : new BigNumber(23.4511)});
  // http://keisan.casio.com/calculator results in 7.6749054545454545454545455
  assert.strictEqual(run.get("speedKmHr").toString(), "7.67490545454545454545");

  run.setProperties({timeSec : new BigNumber(11), lengthM : new BigNumber(23.4510)});
  // http://keisan.casio.com/calculator results in 7.6748727272727272727272727
  assert.strictEqual(run.get("speedKmHr").toString(), "7.67487272727272727273");

  run.setProperties({timeSec : new BigNumber(11), lengthM : new BigNumber(12.121)});
  // http://keisan.casio.com/calculator results in 3.9668727272727272727272727
  assert.strictEqual(run.get("speedKmHr").toString(), "3.96687272727272727273");
});

test('speedKmHr can round down', function(assert) {
  var run = this.subject({timeSec : new BigNumber(49), lengthM : new BigNumber(12.9912)});
  // http://keisan.casio.com/calculator results in 0.9544555102040816326531
  assert.strictEqual(run.get("speedKmHr").toString(), "0.95445551020408163265");

  run.setProperties({timeSec : new BigNumber(11), lengthM : new BigNumber(12.9912)});
  // http://keisan.casio.com/calculator results in 4.2516654545454545454545455
  assert.strictEqual(run.get("speedKmHr").toString(), "4.25166545454545454545");

  run.setProperties({timeSec : new BigNumber(11), lengthM : new BigNumber(23.9912)});
  // http://keisan.casio.com/calculator results in 7.8516654545454545454545455
  assert.strictEqual(run.get("speedKmHr").toString(), "7.85166545454545454545");
});

test('speedKmHr setter changes speedKmHr', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("speedKmHr", "21");
	assert.strictEqual(run.get("speedKmHr").toString(), "21");
});

test('speedKmHr setter also works with integer', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("speedKmHr", 2);
	assert.strictEqual(run.get("speedKmHr").toString(), "2");
});

test('speedKmHr setter can handle floats', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("speedKmHr", 2.2);
	assert.strictEqual(run.get("speedKmHr").toString(), "2.2");
	run.set("speedKmHr", "2.5");
	assert.strictEqual(run.get("speedKmHr").toString(), "2.5");
	run.set("speedKmHr", 2.21234);
	assert.strictEqual(run.get("speedKmHr").toString(), "2.21234");
});

test('speedKmHr setter changes timeSec', function(assert) {
	var run = this.subject({lengthM : new BigNumber(8000)});
	run.set("speedKmHr", "2");
	assert.strictEqual(run.get("timeSec").toString(), "14400"); // 8km with 2km/hr will take 4 hours (14400 sek)
});

test('speedKmHr setter doesn\'t change lengthM', function(assert) {
  var run = this.subject({lengthM : new BigNumber(2500)});
	run.set("speedKmHr", "12");
	assert.strictEqual(run.get("lengthM").toString(), "2500");
});

// speedKmHrStackKm
test('speedKmHrStackKm property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(25000)});
 	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "25");
});

test('speedKmHrStackKm property can be zero', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(1500)});
 	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "0");
});

test('speedKmHrStackKm setter changes speedKmHrStackKm', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24000)});
	run.set("speedKmHrStackKm", "18");
	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "18");
});

test('speedKmHrStackKm setter can handle floats', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24000)});
	run.set("speedKmHrStackKm", "5.5");
	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "6");
	run.set("speedKmHrStackKm", 2.3);
	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "2");
});

test('speedKmHrStackKm setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24123)});
	run.set("speedKmHrStackKm", 12);
	assert.strictEqual(run.get("speedKmHrStackKm").toString(), "12");
});

test('speedKmHrStackKm setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(8000)});
	run.set("speedKmHrStackKm", "2");
	assert.strictEqual(run.get("timeSec").toString(), "14400"); // 8km with 2km/hr will take 4 hours (14400 sek)
});

test('speedKmHrStackKm setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(2500)});
	run.set("speedKmHrStackKm", "12");
	assert.strictEqual(run.get("lengthM").toString(), "2500");
});

// speedKmHrStackDecimal
test('speedKmHrStackDecimal property is calculated from timeSec and lengthM and can round down', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(25123)});
 	assert.strictEqual(run.get("speedKmHrStackDecimal"), "12");
});

test('speedKmHrStackDecimal property can round up', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(25125)});
 	assert.strictEqual(run.get("speedKmHrStackDecimal"), "13");
});

test('speedKmHrStackDecimal can have 1 digit', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12800)});
 	assert.strictEqual(run.get("speedKmHrStackDecimal"), "8");
});

test('speedKmHrStackDecimal supports leading zero', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12012)});
 	assert.strictEqual(run.get("speedKmHrStackDecimal"), "01");
});

test('speedKmHrStackDecimal can be zero', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
 	assert.strictEqual(run.get("speedKmHrStackDecimal"), "0");
});

test('speedKmHrStackDecimal setter changes speedKmHrStackDecimal', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedKmHrStackDecimal", "9");
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "9");
});

test('speedKmHrStackDecimal setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedKmHrStackDecimal", 9);
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "9");
});

test('speedKmHrStackDecimal setter can handle floats', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedKmHrStackDecimal", "8.2");
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "8");
	run.set("speedKmHrStackDecimal", 8.5);
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "9");
});

test('speedKmHrStackDecimal setter works with leading zeros', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedKmHrStackDecimal", "09");
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "09");
	run.set("speedKmHrStackDecimal", "002");
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "0");
	run.set("speedKmHrStackDecimal", "009");
	assert.strictEqual(run.get("speedKmHrStackDecimal"), "01");
});

test('speedKmHrStackDecimal setter changes timeSec', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(3000)});
	run.set("speedKmHrStackKm", "1");
	run.set("speedKmHrStackDecimal", "5");
	assert.strictEqual(run.get("timeSec").toString(), "7200"); // 3km with 1,5km/hr will take 2 hours (7200 sek)
});

test('speedKmHrStackDecimal setter doesn\'t change lengthM', function(assert) {
  var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedKmHrStackDecimal", "9");
	assert.strictEqual(run.get("lengthM").toString(), "12000");
});

test('speedKmHrStackKm and speedKmHrStackDecimal setter will define speedKmHr', function(assert) {
  var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(4400)});
	run.setProperties({
		"speedKmHrStackKm" : "12",
		"speedKmHrStackDecimal" : "05"
	});
	assert.strictEqual(run.get("speedKmHr").toString(), "12.05");
});

// speedMiHr
test('speedMiHr property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1609.344)});
  assert.strictEqual(run.get("speedMiHr").toString(), "1");
});


test('speedMiHr can have up to 20 decimal places and can round up', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1629.364239)});
  // http://keisan.casio.com/calculator results in 1.0124399997763063707945598
  assert.strictEqual(run.get("speedMiHr").toString(), "1.01243999977630637079");

  run.setProperties({timeSec : new BigNumber(3600), lengthM : new BigNumber(1629.380333)});
  // http://keisan.casio.com/calculator results in 1.0124500001242742384474668
  assert.strictEqual(run.get("speedMiHr").toString(), "1.01245000012427423845");

  run.setProperties({timeSec : new BigNumber(3600), lengthM : new BigNumber(1629.380322)});
  // http://keisan.casio.com/calculator results in 1.0124499932891911238367931
  assert.strictEqual(run.get("speedMiHr").toString(), "1.01244999328919112384");
});

test('speedMiHr can round up', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1629.380999)});
  // http://keisan.casio.com/calculator results in 1.0124504139574882685118906
  assert.strictEqual(run.get("speedMiHr").toString(), "1.01245041395748826851");

  run.setProperties({timeSec : new BigNumber(3600), lengthM : new BigNumber(1721)});
  // http://keisan.casio.com/calculator results in 1.0693798218404517617116042
  assert.strictEqual(run.get("speedMiHr").toString(), "1.06937982184045176171");

  run.setProperties({timeSec : new BigNumber(3600), lengthM : new BigNumber(12345.12)});
  // http://keisan.casio.com/calculator results in 7.6709019327129563350035791
  assert.strictEqual(run.get("speedMiHr").toString(), "7.670901932712956335"); // two zeros at the end are falling away
});

test('speedMiHr setter changes speedMiHr', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("speedMiHr", "2");
	assert.strictEqual(run.get("speedMiHr").toString(), "2");
});

test('speedMiHr setter also works with integer', function(assert) {
 	var run = this.subject({lengthM : new BigNumber(1000)});
	run.set("speedMiHr", 2);
	assert.strictEqual(run.get("speedMiHr").toString(), "2");
});

test('speedMiHr setter can handle floats', function(assert) {
	var run = this.subject({lengthM : new BigNumber(1609.344)});
	run.set("speedMiHr", 2.2);
	assert.strictEqual(run.get("speedMiHr").toString(), "2.2");
	run.set("speedMiHr", "2.5");
	assert.strictEqual(run.get("speedMiHr").toString(), "2.5");
	run.set("speedMiHr", 2.21234);
	assert.strictEqual(run.get("speedMiHr").toString(), "2.21234");
});

test('speedMiHr setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(6437.376)});
	run.set("speedMiHr", "2");
	assert.strictEqual(run.get("timeSec").toString(), "7200"); // 4mi with 2mi/hr will take 2 hours (7200 sek)
});

test('speedMiHr setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(6437.376)});
	run.set("speedMiHr", "12");
	assert.strictEqual(run.get("lengthM").toString(), "6437.376");
});

// speedMiHrStackMi
test('speedMiHrStackMi property is calculated from timeSec and lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(4000)});
 	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "2");
});

test('speedMiHrStackMi property can be zero', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1000)});
 	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "0");
});

test('speedMiHrStackMi setter changes speedMiHrStackMi', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24000)});
	run.set("speedMiHrStackMi", "18");
	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "18");
});

test('speedMiHrStackMi setter can handle floats', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24000)});
	run.set("speedMiHrStackMi", "5.5");
	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "6");
	run.set("speedMiHrStackMi", 2.3);
	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "2");
});

test('speedMiHrStackMi setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(24123)});
	run.set("speedMiHrStackMi", 12);
	assert.strictEqual(run.get("speedMiHrStackMi").toString(), "12");
});

test('speedMiHrStackMi setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(6437.376)});
	run.set("speedMiHrStackMi", "4");
	assert.strictEqual(run.get("timeSec").toString(), "3600"); // 4mi with 4mi/hr will take 1 hour (3600 sek)
});

test('speedMiHrStackMi setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(2500)});
	run.set("speedMiHrStackMi", "12");
	assert.strictEqual(run.get("lengthM").toString(), "2500");
});

// speedMiHrStackDecimal
test('speedMiHrStackDecimal property is calculated from timeSec and lengthM and can round down', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(2500.920576)}); // 1.554 mi
 	assert.strictEqual(run.get("speedMiHrStackDecimal"), "55");
});

test('speedMiHrStackDecimal property can round up', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(2502.52992)}); // 1.555 mi
 	assert.strictEqual(run.get("speedMiHrStackDecimal"), "56");
});

test('speedMiHrStackDecimal can have 1 digit', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(2414.02)}); // 1.5 mi
 	assert.strictEqual(run.get("speedMiHrStackDecimal"), "5");
});

test('speedMiHrStackDecimal supports leading zero', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1689.811)}); // 1.05 mi
 	assert.strictEqual(run.get("speedMiHrStackDecimal"), "05");
});

test('speedMiHrStackDecimal can be zero', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(1609.34)}); // 1.00 mi
 	assert.strictEqual(run.get("speedMiHrStackDecimal"), "0");
});

test('speedMiHrStackDecimal setter changes speedMiHrStackDecimal', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedMiHrStackDecimal", "9");
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "9");
});

test('speedMiHrStackDecimal setter also works with integer', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedMiHrStackDecimal", 9);
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "9");
});

test('speedMiHrStackDecimal setter can handle floats', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(12000)});
	run.set("speedMiHrStackDecimal", "8.2");
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "8");
	run.set("speedMiHrStackDecimal", 8.5);
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "9");
});

test('speedMiHrStackDecimal setter works with leading zeros', function(assert) {
	var run = this.subject({timeSec :  new BigNumber(3600), lengthM :  new BigNumber(12000)});
	run.set("speedMiHrStackDecimal", "09");
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "09");
	run.set("speedMiHrStackDecimal", "002");
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "0");
	run.set("speedMiHrStackDecimal", "009");
	assert.strictEqual(run.get("speedMiHrStackDecimal"), "01");
});

test('speedMiHrStackDecimal setter changes timeSec', function(assert) {
	var run = this.subject({timeSec : new BigNumber(3600), lengthM : new BigNumber(4828.032)});
	run.set("speedMiHrStackMi", "1");
	run.set("speedMiHrStackDecimal", "5");
	assert.strictEqual(run.get("timeSec").toString(), "7200"); // 3m with 1,5m/hr will take 2 hours (7200 sek)
});

test('speedMiHrStackDecimal setter doesn\'t change lengthM', function(assert) {
	var run = this.subject({timeSec :  new BigNumber(3600), lengthM :  new BigNumber(12000)});
	run.set("speedMiHrStackDecimal", "9");
	assert.strictEqual(run.get("lengthM").toString(), "12000");
});

test('speedMiHrStackMi and speedMiHrStackDecimal setter will define speedMiHr', function(assert) {
	var run = this.subject({timeSec : new BigNumber(7200), lengthM : new BigNumber(4400)});
	run.setProperties({
		"speedMiHrStackMi" : "12",
		"speedMiHrStackDecimal" : "05"
	});
	assert.strictEqual(run.get("speedMiHr").toString(), "12.05");

  run.setProperties({
    "speedMiHrStackMi" : "12",
    "speedMiHrStackDecimal" : "04"
  });
  assert.strictEqual(run.get("speedMiHr").toString(), "12.04");

  run.setProperties({
    "speedMiHrStackMi" : "1",
    "speedMiHrStackDecimal" : "04"
  });
  assert.strictEqual(run.get("speedMiHr").toString(), "1.04");
});

// some edge cases found during development
test('speedKmHr accuracy edge case was fixed', function(assert) {
  var run = this.subject({timeSec : new BigNumber(30), lengthM : new BigNumber(23.4511)});
  // older version of speedKmHr getter resulted in 2.81413200000000000113
  // problem was fixed by optmizing the calculation by eleminating a dividedBy call
  assert.strictEqual(run.get("speedKmHr").toString(), "2.814132");
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

test('_removeEndingZeros returns an empty string if the parameter is undefined', function(assert) {
	assert.strictEqual(this.subject()._removeEndingZeros(), "");
});

test('_removeEndingZeros returns an empty string if the parameter is an empty string', function(assert) {
	assert.strictEqual(this.subject()._removeEndingZeros(""), "");
});

test('_ensureBigNumber can handle numeric strings', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber("1");
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), "1");

  ensureBigNumber = this.subject()._ensureBigNumber("1.1");
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), "1.1");
});

test('_ensureBigNumber can handle floats', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber(1.1);
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), "1.1");
});

test('_ensureBigNumber will leave BigNumber input unchanged', function(assert) {
  var bigNumber = new BigNumber(1.23456);
  var ensureBigNumber = this.subject()._ensureBigNumber(bigNumber);
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), "1.23456");
  assert.strictEqual(ensureBigNumber, bigNumber);
});

test('_ensureBigNumber will treat non numeric input as 0', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber("dumb user input from a random hacker kid");
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), "0");
});
