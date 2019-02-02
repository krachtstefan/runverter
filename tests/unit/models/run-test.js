import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('run', 'Run Model', {
  needs: ['model:splits']
});

test('run is a valid ember data Model', function(assert) {
  var runSubject = this.subject();
  assert.ok(runSubject);
  assert.ok(runSubject instanceof DS.Model);
});

// createdAt
test('createdAt is from type Date', function(assert) {
  var runSubject = this.subject();
  assert.strictEqual(runSubject.get('createdAt').constructor.name, 'Date');
});

test('createdAt equals current date', function(assert) {
  var runSubject = this.subject();
  var today = new Date();
  assert.strictEqual(runSubject.get('createdAt').toString(), today.toString());
});

// updatedAt
test('updatedAt is from type Date', function(assert) {
  var runSubject = this.subject();
  assert.strictEqual(runSubject.get('createdAt').constructor.name, 'Date');
});

test('updatedAt equals current date', function(assert) {
  var runSubject = this.subject();
  var today = new Date();
  assert.strictEqual(runSubject.get('updatedAt').toString(), today.toString());
});

// timeSec
test('timeSec property can not be negative', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(1800) });
  assert.strictEqual(runSubject.get('timeSec').toString(), '1800');

  run(function() {
    runSubject.set('timeSec', new BigNumber(-10));
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '0');

  run(function() {
    runSubject.set('timeHr', '-10');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '0');
});

// timeHr
test('timeHr property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(14400) });
  assert.strictEqual(runSubject.get('timeHr').toString(), '4');
});

test('timeHr can have up to 20 decimal places', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(14560) });
  assert.strictEqual(
    runSubject.get('timeHr').toString(),
    '4.04444444444444444444'
  );
});

test('timeHr setter changes timeHr', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeHr', '2');
  });
  assert.strictEqual(runSubject.get('timeHr').toString(), '2');
});

test('timeHr setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeHr', '2.5');
  });
  assert.strictEqual(runSubject.get('timeHr').toString(), '2.5');
  run(function() {
    runSubject.set('timeHr', 2.3);
  });
  assert.strictEqual(runSubject.get('timeHr').toString(), '2.3');
});

test('timeHr setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeHr', 2);
  });
  assert.strictEqual(runSubject.get('timeHr').toString(), '2');
});

test('timeHr setter changes timeSec', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeHr', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '7200');
  run(function() {
    runSubject.set('timeHr', '2.123');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '7642.8');
});

// timeMin
test('timeMin property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(3600) });
  assert.strictEqual(runSubject.get('timeMin').toString(), '60');
});

test('timeMin can have up to 20 decimal places', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(2612) });
  assert.strictEqual(
    runSubject.get('timeMin').toString(),
    '43.53333333333333333333'
  );
});

test('timeMin setter changes timeMin', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeMin', '100');
  });
  assert.strictEqual(runSubject.get('timeMin').toString(), '100');
});

test('timeMin setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeMin', '100.5');
  });
  assert.strictEqual(runSubject.get('timeMin').toString(), '100.5');
  run(function() {
    runSubject.set('timeMin', 50.5);
  });
  assert.strictEqual(runSubject.get('timeMin').toString(), '50.5');
});

test('timeMin setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeMin', 100);
  });
  assert.strictEqual(runSubject.get('timeMin').toString(), '100');
});

test('timeMin setter changes timeSec', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeMin', '12');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '720');
  run(function() {
    runSubject.set('timeMin', '12.123');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '727.38');
});

// timeStackHr
test('timeStackHr property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(20000) });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '5');
});

test('timeStackHr property can be zero', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(2500) });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '0');
});

test('timeStackHr rounds properly', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(1) });
  run(function() {
    runSubject.set('timeSec', new BigNumber(3600));
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '1'); // 1:00:00
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0');

  run(function() {
    runSubject.set('timeSec', new BigNumber(3599));
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '0'); // 0:59:59
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '59');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '59');

  run(function() {
    runSubject.set('timeSec', new BigNumber(3599.5));
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '1'); // 0:59:59.5 will be rounded to 1:00:00
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0');

  run(function() {
    runSubject.set('timeHr', new BigNumber(0.995));
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '0'); // the timeHr of 0.995 results in a timeStac of 0:59:42, no need to round up
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '59');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '42');
});

test('timeStackHr setter changes timeStackHr', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackHr', '2');
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '2');
});

test('timeStackHr setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackHr', '2.2');
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '2');
  run(function() {
    runSubject.set('timeStackHr', 2.5);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '3');
});

test('timeStackHr setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackHr', 2);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '2');
});

test('timeStackHr setter influences all time related properties', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(12612) }); // 3,5 hours and 12 seconds
  run(function() {
    runSubject.set('timeStackHr', '2');
  }); // 2,5 hours and 12 seconds
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '2');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '30');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '12');
  assert.strictEqual(runSubject.get('timeSec').toString(), '9012');
});

// timeStackMin
test('timeStackMin property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(145) });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '2');
});

test('timeStackMin property can be zero', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(59) });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0');
});

test('timeStackMin rounds properly', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(14400),
    lengthM: new BigNumber(42195)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', '5');
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0'); // was -1 when calculation was based on raw values without round()

  run(function() {
    runSubject.set('timeMin', new BigNumber('0.994'));
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '1'); // the timeMin of 0.994 results in a timeStackMin of 1 (59.64 seconds)

  run(function() {
    runSubject.set('timeMin', new BigNumber('0.991'));
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0'); // the timeMin of 0.991 results in a timeStackMin of 1 (59.46 seconds)

  run(function() {
    runSubject.setProperties({
      paceMinPerKmStackMin: '5',
      paceMinPerKmStackSec: '41'
    });
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '48');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '59');
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '3');

  run(function() {
    runSubject.set('timeSec', new BigNumber(3599.5));
  }); // 0:59:59.5 will be rounded to 1:00:00
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '1');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0');
});

test('timeStackMin setter changes timeStackMin', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMin', '10');
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '10');
});

test('timeStackMin setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMin', '2.2');
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '2');
  run(function() {
    runSubject.set('timeStackMin', 2.5);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '3');
});

test('timeStackMin setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMin', 2);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '2');
});

test('timeStackMin setter handles negative values and changes timeStackHr', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackHr', 5);
  });
  run(function() {
    runSubject.set('timeStackMin', 55);
  });
  run(function() {
    runSubject.set('timeStackMin', -10);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '4');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '50');
});

test('timeStackMin setter handles values over 59 and changes timeStackHr', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackHr', 5);
  });
  run(function() {
    runSubject.set('timeStackMin', 60);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '6');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '0');
  run(function() {
    runSubject.set('timeStackHr', 5);
  });
  run(function() {
    runSubject.set('timeStackMin', 80);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '6');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '20');
});

test('timeStackMin setter influences all time related properties', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(90) }); // 1 minute, 30 seconds
  run(function() {
    runSubject.set('timeStackMin', '10');
  }); // 10 minutes, 30 seconds
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '0');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '10');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '30');
  assert.strictEqual(runSubject.get('timeSec').toString(), '630');
});

// timeStackMinFixed
test('timeStackMinFixed property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(240) });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '04');
});

test('timeStackMinFixed has leading zero(s)', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(120) });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '02');
  run(function() {
    runSubject.set('timeSec', new BigNumber('2'));
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '00');
});

test('timeStackMinFixed can be zero', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(2) });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '00');
});

test('timeStackMinFixed setter changes timeStackMinFixed', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMinFixed', '30');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '30');
});

test('timeStackMinFixed setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMinFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '08');
  run(function() {
    runSubject.set('timeStackMinFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '10');
});

test('timeStackMinFixed setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMinFixed', 20);
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '20');
});

test('timeStackMinFixed setter works with single digit', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMinFixed', '9');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '09');
});

test('timeStackMinFixed setter handles negative values and changes timeStackHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('timeHr', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackMinFixed', -40);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '5');
  assert.strictEqual(runSubject.get('timeStackMinFixed').toString(), '20');

  run(function() {
    runSubject.set('timeHr', new BigNumber('5'));
  });
  run(function() {
    runSubject.set('timeStackMinFixed', -1);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '4');
  assert.strictEqual(runSubject.get('timeStackMinFixed').toString(), '59');
});

test('timeStackMinFixed setter handles values over 59 and changes timeStackHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('timeHr', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackMinFixed', 60);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '7');
  assert.strictEqual(runSubject.get('timeStackMinFixed').toString(), '00');

  run(function() {
    runSubject.set('timeHr', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackMinFixed', 90);
  });
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '7');
  assert.strictEqual(runSubject.get('timeStackMinFixed').toString(), '30');
});

test('timeStackMinFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMinFixed', '09');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '09');
  run(function() {
    runSubject.set('timeStackMinFixed', '002');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '02');
  run(function() {
    runSubject.set('timeStackMinFixed', '009');
  });
  assert.strictEqual(runSubject.get('timeStackMinFixed'), '09');
});

test('timeStackMinFixed setter influences all time related properties', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(90) }); // 1 minute, 30 seconds
  run(function() {
    runSubject.set('timeStackMinFixed', '10');
  }); // 10 minutes, 30 seconds
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '0');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '10');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '30');
  assert.strictEqual(runSubject.get('timeSec').toString(), '630');
});

// timeStackSec
test('timeStackSec property is calculated from timeSec', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(62) });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '2');
});

test('timeStackSec property can be zero', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(60) });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0');
});

test('timeStackSec rounds properly', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(14400),
    lengthM: new BigNumber(42195)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', '5');
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0'); // was 59.99999999999999999999993592 before round()
});

test('timeStackSec setter changes timeStackSec', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSec', '10');
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '10');
});

test('timeStackSec setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSec', '2.2');
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '2');
  run(function() {
    runSubject.set('timeStackSec', 2.5);
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '3');
});

test('timeStackSec setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSec', 2);
  });
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '2');
});

test('timeStackSec setter handles negative values and changes timeStackMin', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMin', 5);
  });
  run(function() {
    runSubject.set('timeStackSec', 50);
  });
  run(function() {
    runSubject.set('timeStackSec', -10);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '4');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '50');
});

test('timeStackSec setter handles values over 59 and changes timeStackMin', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackMin', 5);
  });
  run(function() {
    runSubject.set('timeStackSec', 60);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '0');
  run(function() {
    runSubject.set('timeStackMin', 5);
  });
  run(function() {
    runSubject.set('timeStackSec', 80);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '20');
});

test('timeStackSec setter influences all time related properties', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(12612) }); // 3,5 hours and 12 seconds
  run(function() {
    runSubject.set('timeStackSec', '20');
  }); // 3,5 hours and 20 seconds
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '3');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '30');
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '20');
  assert.strictEqual(runSubject.get('timeSec').toString(), '12620');
});

test('timeStackSec setter handles values bigger than 59', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(12612) }); // 3,5 hours and 12 seconds
  run(function() {
    runSubject.set('timeStackSec', '62');
  }); // 3,5 hours and 62 seconds
  assert.strictEqual(runSubject.get('timeStackHr').toString(), '3');
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '31'); // 30 flips to 31 because 62 seconds starts another minute
  assert.strictEqual(runSubject.get('timeStackSec').toString(), '2');
  assert.strictEqual(runSubject.get('timeSec').toString(), '12662');
});

// timeStackSecFixed
test('timeStackSecFixed property is calculated from timeSec and can round down', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(59.4) });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '59');
});

test('timeStackSecFixed property can round up', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(59.6) });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '00');
});

test('timeStackSecFixed has leading zero(s)', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(2) });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '02');
  run(function() {
    runSubject.set('timeSec', new BigNumber('60'));
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '00');
});

test('timeStackSecFixed can be zero', function(assert) {
  var runSubject = this.subject({ timeSec: new BigNumber(120) });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '00');
});

test('timeStackSecFixed setter changes timeStackSecFixed', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSecFixed', '30');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '30');
});

test('timeStackSecFixed setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSecFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '08');
  run(function() {
    runSubject.set('timeStackSecFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '10');
});

test('timeStackSecFixed setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSecFixed', 20);
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '20');
});

test('timeStackSecFixed setter works with single digit', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSecFixed', '9');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '09');
});

test('timeStackSecFixed setter handles negative values and changes timeStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('timeMin', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackSecFixed', -40);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '5');
  assert.strictEqual(runSubject.get('timeStackSecFixed').toString(), '20');

  run(function() {
    runSubject.set('timeMin', new BigNumber('5'));
  });
  run(function() {
    runSubject.set('timeStackSecFixed', -1);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '4');
  assert.strictEqual(runSubject.get('timeStackSecFixed').toString(), '59');
});

test('timeStackSecFixed setter handles values over 59 and changes timeStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('timeMin', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackSecFixed', 60);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '7');
  assert.strictEqual(runSubject.get('timeStackSecFixed').toString(), '00');

  run(function() {
    runSubject.set('timeMin', new BigNumber('6.5'));
  });
  run(function() {
    runSubject.set('timeStackSecFixed', 90);
  });
  assert.strictEqual(runSubject.get('timeStackMin').toString(), '7');
  assert.strictEqual(runSubject.get('timeStackSecFixed').toString(), '30');
});

test('timeStackSecFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('timeStackSecFixed', '09');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '09');
  run(function() {
    runSubject.set('timeStackSecFixed', '002');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '02');
  run(function() {
    runSubject.set('timeStackSecFixed', '009');
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed'), '09');
});

test('timeStackSecFixed setter changes timeMin', function(assert) {
  var runSubject = this.subject({ timeMin: new BigNumber(5) });
  run(function() {
    runSubject.set('timeStackSecFixed', '30');
  });
  assert.strictEqual(runSubject.get('timeMin').toString(), '5.5');
});

test('timeStackMin and timeStackSecFixed setter will define timeMin', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({ timeStackMin: '6', timeStackSecFixed: '20' });
  });
  assert.strictEqual(
    runSubject.get('timeMin').toString(),
    '6.33333333333333333333'
  );
});

// lengthM
test('lengthM property can not be negative', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1800) });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1800');

  run(function() {
    runSubject.set('lengthM', new BigNumber(-10));
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '0');

  run(function() {
    runSubject.set('lengthMi', '-10');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '0');
});

// lengthMStackM
test('lengthMStackM property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1800) });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '1800');
});

test('lengthMStackM property can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(0) });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '0');
  run(function() {
    runSubject.set('lengthM', new BigNumber(0.3));
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '0');
});

test('lengthMStackM rounds properly', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(0.995) });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '1'); // the lengthM of 0.995 results in a lengthMStackM of 1
  run(function() {
    runSubject.set('lengthM', new BigNumber(0.994));
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '0'); // the lengthM of 0.994 results in a lengthMStackM of 0
});

test('lengthMStackM setter changes lengthMStackM', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackM', '2');
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '2');
});

test('lengthMStackM setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackM', '2.9');
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '3');
  run(function() {
    runSubject.set('lengthMStackM', 2.3);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '2');
});

test('lengthMStackM setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackM', 2);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '2');
});

test('lengthMStackM setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1234.56) });
  run(function() {
    runSubject.set('lengthMStackM', '2');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2.56');
});

// lengthMStackDecimal
test('lengthMStackDecimal property is calculated from lengthM and can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(10.454) });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '45');
});

test('lengthMStackDecimal property can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(10.455) });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '46');
});

test('lengthMStackDecimal can have 1 digit', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12.4) });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '4');
});

test('lengthMStackDecimal supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12.05) });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '05');
});

test('lengthMStackDecimal can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12) });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '0');
  run(function() {
    runSubject.set('lengthM', new BigNumber(0.004));
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '0');
});

test('lengthMStackDecimal setter changes lengthMStackDecimal', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '9');
});

test('lengthMStackDecimal setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimal', '8.2');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '8');
  run(function() {
    runSubject.set('lengthMStackDecimal', 9.5);
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '1');
});

test('lengthMStackDecimal setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimal', 9);
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '9');
});

test('lengthMStackDecimal setter handles negative values and changes lengthMStackM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimal', -10);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '4');
  assert.strictEqual(runSubject.get('lengthMStackDecimal').toString(), '9');
});

test('lengthMStackDecimal setter handles values over 99 and changes lengthMStackM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimal', 100);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '5');
  assert.strictEqual(runSubject.get('lengthMStackDecimal').toString(), '1');

  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimal', 123);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '5');
  assert.strictEqual(runSubject.get('lengthMStackDecimal').toString(), '12');
});

test('lengthMStackDecimal setter works with leading zeros', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '09');
  run(function() {
    runSubject.set('lengthMStackDecimal', '002');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '0');
  run(function() {
    runSubject.set('lengthMStackDecimal', '009');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimal'), '01');
});

test('lengthMStackDecimal setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('lengthMStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1000.09');
});

test('lengthMStackM and lengthMStackDecimal setter will define lengthM', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthMStackM: '12',
      lengthMStackDecimal: '09'
    });
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12.09');
});

// lengthMStackDecimalFixed
test('lengthMStackDecimalFixed property is calculated from lengthM and can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12.121) });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '12');
});

test('lengthMStackDecimalFixed property can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12.715) });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '72');
});

test('lengthMStackDecimalFixed has trailing zero(s)', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(0.5) });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '50');
  run(function() {
    runSubject.set('lengthM', new BigNumber('5'));
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '00');
});

test('lengthMStackDecimalFixed supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(0.09) });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthM', new BigNumber(0.005));
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '01');
});

test('lengthMStackDecimalFixed can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(99) });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '00');
});

test('lengthMStackDecimalFixed setter changes lengthMStackDecimalFixed', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '90');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '90');
});

test('lengthMStackDecimalFixed setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '80');
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '10');
});

test('lengthMStackDecimalFixed setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', 9);
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '90');
});

test('lengthMStackDecimalFixed setter works with single digit', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '9');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '90');
});

test('lengthMStackDecimalFixed setter handles negative values and changes lengthMStackM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', -10);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthMStackDecimalFixed').toString(),
    '90'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber('5.0'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', -1);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthMStackDecimalFixed').toString(),
    '99'
  );
});

test('lengthMStackDecimalFixed setter handles values over 99 and changes lengthMStackM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', 100);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthMStackDecimalFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', 123);
  });
  assert.strictEqual(runSubject.get('lengthMStackM').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthMStackDecimalFixed').toString(),
    '23'
  );
});

test('lengthMStackDecimalFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '002');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '00');
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '009');
  });
  assert.strictEqual(runSubject.get('lengthMStackDecimalFixed'), '01');
});

test('lengthMStackDecimalFixed setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('lengthMStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1000.09');
});

test('lengthMStackM and lengthMStackDecimalFixed setter will define lengthM', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthMStackM: '12',
      lengthMStackDecimalFixed: '9'
    });
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12.9');
});

// lengthKm
test('lengthKm property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '2');
});

test('lengthKm can have up to 20 decimal places and can round up', function(assert) {
  // BigNumber can only be initialized with 15 digit, dividing it will result in more digits
  var runSubject = this.subject({
    lengthM: new BigNumber('9.12345678901234').dividedBy(6)
  });
  // http://keisan.casio.com/calculator results in 0.0015205761315020566666666667
  assert.strictEqual(
    runSubject.get('lengthKm').toString(),
    '0.00152057613150205667'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber('8.78748598595').dividedBy(3));
  });
  // http://keisan.casio.com/calculator results in 0.0029291619953166666666666667
  assert.strictEqual(
    runSubject.get('lengthKm').toString(),
    '0.00292916199531666667'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber('8.123455').dividedBy(7));
  });
  // http://keisan.casio.com/calculator results in 0.0011604935714285714285714286
  assert.strictEqual(
    runSubject.get('lengthKm').toString(),
    '0.00116049357142857143'
  );
});

test('lengthKm can round down', function(assert) {
  // BigNumber can only be initialized with 15 digit, dividing it will result in more digits
  var runSubject = this.subject({
    lengthM: new BigNumber('9.12345678901234').dividedBy(9)
  });
  // http://keisan.casio.com/calculator results in 0.001013717421001371111111

  run(function() {
    runSubject.set(
      'lengthM',
      new BigNumber('9.3343442341212212212').dividedBy(5)
    );
  });
  // http://keisan.casio.com/calculator results in 0.00186686884682424424424
  assert.strictEqual(
    runSubject.get('lengthKm').toString(),
    '0.00186686884682424424'
  );

  run(function() {
    runSubject.set(
      'lengthM',
      new BigNumber('9.3343442341214223423324212').dividedBy(3)
    );
  });
  // http://keisan.casio.com/calculator results in 0.0031114480780404741141108071
  assert.strictEqual(
    runSubject.get('lengthKm').toString(),
    '0.00311144807804047411'
  );
});

test('lengthKm setter changes lengthKm', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKm', '100');
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '100');
});

test('lengthKm setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKm', '100.12345');
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '100.12345');
  run(function() {
    runSubject.set('lengthKm', 100.34);
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '100.34');
});

test('lengthKm setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKm', 100);
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '100');
});

test('lengthKm setter changes lengthM', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKm', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12000');
  run(function() {
    runSubject.set('lengthKm', '12.123');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12123');
});

// lengthKmStackKm
test('lengthKmStackKm property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1800) });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '1');
});

test('lengthKmStackKm property can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(12) });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '0');
});

test('lengthKmStackKm rounds properly', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1) });

  run(function() {
    runSubject.set('lengthKm', new BigNumber(0.995));
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '1'); // the lengthKm of 0.995 results in a lengthKmStackKm of 1

  run(function() {
    runSubject.set('lengthKm', new BigNumber(0.994));
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '0'); // the lengthKm of 0.994 results in a lengthKmStackKm of 0
});

test('lengthKmStackKm setter changes lengthKmStackKm', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackKm', '2');
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '2');
});

test('lengthKmStackKm setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackKm', '2.9');
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '3');
  run(function() {
    runSubject.set('lengthKmStackKm', 2.3);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '2');
});

test('lengthKmStackKm setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackKm', 2);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '2');
});

test('lengthKmStackKm setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1234) });
  run(function() {
    runSubject.set('lengthKmStackKm', '2');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2234');
});

// lengthKmStackDecimal
test('lengthKmStackDecimal property is calculated from lengthM and can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1712) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '71');
});

test('lengthKmStackDecimal property can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1719) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '72');
});

test('lengthKmStackDecimal can have 1 digit', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(500) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '5');
});

test('lengthKmStackDecimal supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(90) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '09');
});

test('lengthKmStackDecimal can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '0');
});

test('lengthKmStackDecimal setter changes lengthKmStackDecimal', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '9');
});

test('lengthKmStackDecimal setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimal', '8.2');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '8');
  run(function() {
    runSubject.set('lengthKmStackDecimal', 9.5);
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '1');
});

test('lengthKmStackDecimal setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimal', 9);
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '9');
});

test('lengthKmStackDecimal setter handles negative values and changes lengthKmStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimal', -10);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '4');
  assert.strictEqual(runSubject.get('lengthKmStackDecimal').toString(), '9');
});

test('lengthKmStackDecimal setter handles values over 99 and changes lengthKmStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimal', 100);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '5');
  assert.strictEqual(runSubject.get('lengthKmStackDecimal').toString(), '1');

  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimal', 123);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '5');
  assert.strictEqual(runSubject.get('lengthKmStackDecimal').toString(), '12');
});

test('lengthKmStackDecimal setter works with leading zeros', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '09');
  run(function() {
    runSubject.set('lengthKmStackDecimal', '002');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '0');
  run(function() {
    runSubject.set('lengthKmStackDecimal', '009');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimal'), '01');
});

test('lengthKmStackDecimal setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('lengthKmStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1090');
});

test('lengthKmStackKm and lengthKmStackDecimal setter will define lengthKm', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthKmStackKm: '12',
      lengthKmStackDecimal: '09'
    });
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '12.09');
});

// lengthKmStackDecimalFixed
test('lengthKmStackDecimalFixed property is calculated from lengthM and can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1712) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '71');
});

test('lengthKmStackDecimalFixed property can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1719) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '72');
});

test('lengthKmStackDecimalFixed has trailing zero(s)', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(500) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '50');
  run(function() {
    runSubject.set('lengthM', new BigNumber(2));
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '00');
});

test('lengthKmStackDecimalFixed supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(90) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthM', new BigNumber(5));
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '01');
});

test('lengthKmStackDecimalFixed can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '00');
});

test('lengthKmStackDecimalFixed setter changes lengthKmStackDecimalFixed', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '90');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '90');
});

test('lengthKmStackDecimalFixed setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '80');
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '10');
});

test('lengthKmStackDecimalFixed setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', 9);
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '90');
});

test('lengthKmStackDecimalFixed setter works with single digit', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '9');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '90');
});

test('lengthKmStackDecimalFixed setter handles negative values and changes lengthKmStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', -10);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthKmStackDecimalFixed').toString(),
    '90'
  );

  run(function() {
    runSubject.set('lengthKm', '5.0');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', -1);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthKmStackDecimalFixed').toString(),
    '99'
  );
});

test('lengthKmStackDecimalFixed setter handles values over 99 and changes lengthKmStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', 100);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthKmStackDecimalFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('lengthKm', '5.5');
  });
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', 123);
  });
  assert.strictEqual(runSubject.get('lengthKmStackKm').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthKmStackDecimalFixed').toString(),
    '23'
  );
});

test('lengthKmStackDecimalFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '002');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '00');
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '009');
  });
  assert.strictEqual(runSubject.get('lengthKmStackDecimalFixed'), '01');
});

test('lengthKmStackDecimalFixed setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('lengthKmStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1090');
});

test('lengthKmStackKm and lengthKmStackDecimalFixed setter will define lengthKm', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthKmStackKm: '12',
      lengthKmStackDecimalFixed: '9'
    });
  });
  assert.strictEqual(runSubject.get('lengthKm').toString(), '12.9');
});

// lengthMi
test('lengthMi property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1609.344) });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '1');
});

test('lengthMi can have up to 20 decimal places and can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(9.12345678901235) });
  // http://keisan.casio.com/calculator results in 0.0056690532223144026385906307
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '0.00566905322231440264'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber(14232.25));
  });
  // http://keisan.casio.com/calculator results in 8.8435101507197963890877277
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '8.84351015071979638909'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber(123.45));
  });
  // http://keisan.casio.com/calculator results in 0.07670827368169887854927225
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '0.07670827368169887855'
  );
});

test('lengthMi can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(9.12345678901234) });
  // http://keisan.casio.com/calculator results in 0.005669053222314396424879
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '0.00566905322231439642'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber(123));
  });
  // http://keisan.casio.com/calculator results in 0.076428656645192078262944405
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '0.07642865664519207826'
  );

  run(function() {
    runSubject.set('lengthM', new BigNumber(12.12));
  });
  // http://keisan.casio.com/calculator results in 0.0075310188499164877117633023
  assert.strictEqual(
    runSubject.get('lengthMi').toString(),
    '0.00753101884991648771'
  );
});

test('lengthMi setter changes lengthMi', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMi', '100');
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '100');
});

test('lengthMi setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMi', '100.55');
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '100.55');
  run(function() {
    runSubject.set('lengthMi', 100.12);
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '100.12');
});

test('lengthMi setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMi', 100);
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '100');
});

test('lengthMi setter changes lengthM', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMi', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '19312.128');
  run(function() {
    runSubject.set('lengthMi', '12.123');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '19510.077312');
});

// lengthMiStackMi
test('lengthMiStackMi property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1800) });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '1');
});

test('lengthMiStackMi property can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(800) });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '0');
});

test('lengthMiStackMi rounds properly', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1) });

  run(function() {
    runSubject.set('lengthMi', new BigNumber(0.995));
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '1'); // the lengthMi of 0.995 results in a lengthMiStackMi of 1

  run(function() {
    runSubject.set('lengthMi', new BigNumber(0.994));
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '0'); // the lengthMi of 0.994 results in a lengthMiStackMi of 0
});

test('lengthMiStackMi setter changes lengthMiStackMi', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackMi', '2');
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '2');
});

test('lengthMiStackMi setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackMi', '2.2');
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '2');
  run(function() {
    runSubject.set('lengthMiStackMi', 2.5);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '3');
});

test('lengthMiStackMi setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackMi', 2);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '2');
});

test('lengthMiStackMi setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1234) });
  run(function() {
    runSubject.set('lengthMiStackMi', '2');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '4452.688');
});

// lengthMiStackDecimal
test('lengthMiStackDecimal property is calculated from lengthM and can round down', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2711) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '68');
});

test('lengthMiStackDecimal property can round up', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2712) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '69');
});

test('lengthMiStackDecimal can have 1 digit', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(804.672) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '5');
});

test('lengthMiStackDecimal supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(100) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '06');
});

test('lengthMiStackDecimal can be zero', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1609.344) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '0');
});

test('lengthMiStackDecimal setter changes lengthMiStackDecimal', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '9');
});

test('lengthMiStackDecimal setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimal', 9.2);
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '9');
  run(function() {
    runSubject.set('lengthMiStackDecimal', '9.5');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '1');
});

test('lengthMiStackDecimal setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimal', 9);
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '9');
});

test('lengthMiStackDecimal setter handles negative values and changes lengthMiStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimal', -10);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '4');
  assert.strictEqual(runSubject.get('lengthMiStackDecimal').toString(), '9');
});

test('lengthMiStackDecimal setter handles values over 99 and changes lengthMiStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimal', 100);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '5');
  assert.strictEqual(runSubject.get('lengthMiStackDecimal').toString(), '1');

  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimal', 123);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '5');
  assert.strictEqual(runSubject.get('lengthMiStackDecimal').toString(), '12');
});

test('lengthMiStackDecimal setter works with leading zeros', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '09');
  run(function() {
    runSubject.set('lengthMiStackDecimal', '002');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '0');
  run(function() {
    runSubject.set('lengthMiStackDecimal', '009');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimal'), '01');
});

test('lengthMiStackDecimal setter changes lengthM', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) }); // around 1.24 miles
  run(function() {
    runSubject.set('lengthMiStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '1754.18496'); // 1.09 miles
});

test('lengthMiStackDecimal and lengthMiStackDecimal setter will define lengthMi', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthMiStackMi: '12',
      lengthMiStackDecimal: '09'
    });
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '12.09');
});

// lengthMiStackDecimalFixed
test('lengthMiStackDecimalFixed property is calculated from lengthMi and can round down', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(10.021) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '02');
});

test('lengthMiStackDecimalFixed property can round up', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(10.025) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '03');
});

test('lengthMiStackDecimalFixed has trailing zero(s)', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(10.1) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '10');
  run(function() {
    runSubject.set('lengthMi', new BigNumber(14));
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '00');
});

test('lengthMiStackDecimalFixed supports leading zero', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(12.09) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthMi', new BigNumber(12.005));
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '01');
});

test('lengthMiStackDecimalFixed can be zero', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(1) });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '00');
});

test('lengthMiStackDecimalFixed setter changes lengthMiStackDecimalFixed', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '90');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '90');
});

test('lengthMiStackDecimalFixed setter can handle floats', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '80');
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '10');
});

test('lengthMiStackDecimalFixed setter also works with integer', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', 9);
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '90');
});

test('lengthMiStackDecimalFixed setter works with single digit', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '9');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '90');
});

test('lengthMiStackDecimalFixed setter handles negative values and changes lengthMiStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', -10);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthMiStackDecimalFixed').toString(),
    '90'
  );

  run(function() {
    runSubject.set('lengthMi', '5.0');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', -1);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '4');
  assert.strictEqual(
    runSubject.get('lengthMiStackDecimalFixed').toString(),
    '99'
  );
});

test('lengthMiStackDecimalFixed setter handles values over 99 and changes lengthMiStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', 100);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthMiStackDecimalFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('lengthMi', '5.5');
  });
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', 123);
  });
  assert.strictEqual(runSubject.get('lengthMiStackMi').toString(), '6');
  assert.strictEqual(
    runSubject.get('lengthMiStackDecimalFixed').toString(),
    '23'
  );
});

test('lengthMiStackDecimalFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '002');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '00');
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '009');
  });
  assert.strictEqual(runSubject.get('lengthMiStackDecimalFixed'), '01');
});

test('lengthMiStackDecimalFixed setter changes lengthMi', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(2) });
  run(function() {
    runSubject.set('lengthMiStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '2.09');
});

test('lengthMiStackMi and lengthMiStackDecimalFixed setter will define lengthMi', function(assert) {
  var runSubject = this.subject();
  run(function() {
    runSubject.setProperties({
      lengthMiStackMi: '12',
      lengthMiStackDecimalFixed: '9'
    });
  });
  assert.strictEqual(runSubject.get('lengthMi').toString(), '12.9');
});

// paceMinPerKm
test('paceMinPerKm property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(60),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '60');
});

test('paceMinPerKm can have up to 20 decimal places and can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.1234567891238),
    lengthM: new BigNumber(900)
  });
  // http://keisan.casio.com/calculator results in 1.2482853212486666666666667
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '1.24828532124866666667'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(2.909),
      lengthM: new BigNumber(93)
    });
  });
  // http://keisan.casio.com/calculator results in 31.279569892473118279569892
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '31.27956989247311827957'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(2.909),
      lengthM: new BigNumber(123)
    });
  });
  // http://keisan.casio.com/calculator results in 23.650406504065040650406504
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '23.65040650406504065041'
  );
});

test('paceMinPerKm can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.1234567891234),
    lengthM: new BigNumber(900)
  });
  // http://keisan.casio.com/calculator results in 1.248285321248222222222
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '1.24828532124822222222'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(2.1234567891238),
      lengthM: new BigNumber(921)
    });
  });
  // http://keisan.casio.com/calculator results in 2.3055991195698154180238871
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '2.30559911956981541802'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(2.12345678238),
      lengthM: new BigNumber(123)
    });
  });
  // http://keisan.casio.com/calculator results in 17.26387627951219512195122
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '17.26387627951219512195'
  );
});

test('paceMinPerKm is not getting infinite when length is zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(0)
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '0');
});

test('paceMinPerKm setter changes paceMinPerKm', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerKm', '21');
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '21');
});

test('paceMinPerKm setter can handle floats', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerKm', 2.2);
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '2.2');
  run(function() {
    runSubject.set('paceMinPerKm', '2.5');
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '2.5');
  run(function() {
    runSubject.set('paceMinPerKm', 2.21234);
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '2.21234');
});

test('paceMinPerKm setter also works with integer', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerKm', 21);
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '21');
});

test('paceMinPerKm setter changes timeSec', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(8000) });
  run(function() {
    runSubject.set('paceMinPerKm', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '960'); // 8km with 2min/km will take 16 min (960 sek)
});

test("paceMinPerKm setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerKm', 21);
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2000');
});

// paceMinPerKmStackMin
test('paceMinPerKmStackMin property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.23454),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '1');
});

test('paceMinPerKmStackMin property can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1500)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '0');
});

test('paceMinPerKmStackMin rounds properly', function(assert) {
  const runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1)
  });

  run(function() {
    runSubject.set('paceMinPerKm', new BigNumber(0.994));
  });

  // 0 Minutes and 59.64 Seconds translates to 1:00
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '1');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0');

  run(function() {
    runSubject.set('paceMinPerKm', new BigNumber(0.99));
  });

  // 0 Minutes and 59.4 Seconds translates to 0:59
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '0');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '59');
});

test('paceMinPerKmStackMin setter changes paceMinPerKmStackMin', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', '12');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '12');
});

test('paceMinPerKmStackMin setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', '5.5');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  run(function() {
    runSubject.set('paceMinPerKmStackMin', 2.3);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '2');
});

test('paceMinPerKmStackMin setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', 12);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '12');
});

test('paceMinPerKmStackMin setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(60),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '300'); // 2km with 2,5min/km will take 5 minutes (300 sek)
});

test("paceMinPerKmStackMin setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackMin', 12);
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2000');
});

// paceMinPerKmStackSec
test('paceMinPerKmStackSec property is calculated from timeMin and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.54),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '32'); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerKmStackSec property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.56),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '34'); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerKmStackSec rounds properly', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(2999.9999999999),
    lengthM: new BigNumber(10000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0'); // was 59.999999999989999999999998 before round()
});

test('paceMinPerKmStackSec can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0');
});

test('paceMinPerKmStackSec setter changes paceMinPerKmStackSec', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', '10');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '10');
});

test('paceMinPerKmStackSec setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', '2.2');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '2');
  run(function() {
    runSubject.set('paceMinPerKmStackSec', 2.5);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '3');
});

test('paceMinPerKmStackSec setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', 2);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '2');
});

test('paceMinPerKmStackSec setter handles negative values and changes paceMinPerKmStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', -10);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '4');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '50');
});

test('paceMinPerKmStackSec setter handles values over 59 and changes paceMinPerKmStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', 60);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0');
  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSec', 80);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '20');
});

test('paceMinPerKmStackSecRaw handles 59 fractions without rounding while paceMinPerKmStackSec does not', function(assert) {
  const runSubject = this.subject({
    timeSec: new BigNumber(1200),
    lengthM: new BigNumber(5007.68)
  });

  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '4');

  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecRaw').toString(),
    '59.631925362642980382133044'
  );

  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0');
});

test('paceMinPerKmStackSec setter influences all pace related properties', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(12),
    lengthM: new BigNumber(2000)
  }); // 6 min/km
  run(function() {
    runSubject.set('paceMinPerKmStackSec', '20');
  }); // 6.3333 min/km
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '20');
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '6.33333333333333333333'
  );
});

test('paceMinPerKmStackSec setter handles values bigger than 59', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(12),
    lengthM: new BigNumber(2000)
  }); // 6 min/km
  run(function() {
    runSubject.set('paceMinPerKmStackSec', '90');
  }); // 7.5000 min/km
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '7'); // 6 flips to 7 because a paceMinPerKmStackSec of 90 flips the paceMinPerKmStackMin
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '30');
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '7.5');
});

test('paceMinPerKmStackSec setter should refer to an uncompressed version paceMinPerKmStackSec (with digits) to have exact results', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600 * 4),
    lengthM: new BigNumber(42195)
  });
  // paceMinPerKmStackSec is calculated from the previous paceMinPerKmStackSec
  // Since this value is normally rounded, it should be used in uncompressed form for calculation

  // In this example paceMinPerKm is currently 5.68787771062922147174
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '5.68787771062922147174'
  );

  // which results in a paceMinPerKmStackSec of 41
  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '41');

  // actually it is 41,272662638 (0.68787771062922147174*60)
  // when setting paceMinPerKmStackSec
  run(function() {
    runSubject.set('paceMinPerKmStackSec', '0');
  });
  // it should refer to 41,272662638 and not 41 to result in 5 (aka 5.00) instead of 5.00454437729588813841
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '5');
});

// paceMinPerKmStackSecFixed
test('paceMinPerKmStackSecFixed property property is calculated from timeMin and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.54),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '32'
  ); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerKmStackSecFixed property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.56),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '34'
  ); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerKmStackSecFixed has leading zero(s)', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(75.083),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '05');
  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(75),
      lengthM: new BigNumber(1000)
    });
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '00');
});

test('paceMinPerKmStackSecFixed can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(60),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '00');
});

test('paceMinPerKmStackSecFixed setter changes paceMinPerKmStackSecFixed', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '10');
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '10'
  );
});

test('paceMinPerKmStackSecFixed setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '2.2');
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '02'
  );
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', 2.5);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '03'
  );
});

test('paceMinPerKmStackSecFixed setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', 12);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '12'
  );
});

test('paceMinPerKmStackSecFixed setter works with single digit', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', 2);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '02'
  );
});

test('paceMinPerKmStackSecFixed setter handles negative values and changes paceMinPerKmStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', -10);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '4');
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '50'
  );

  run(function() {
    runSubject.set('paceMinPerKm', '5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', -1);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '4');
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '59'
  );
});

test('paceMinPerKmStackSecFixed setter handles values over 59 and changes paceMinPerKmStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', 60);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('paceMinPerKm', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', 80);
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '6');
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecFixed').toString(),
    '20'
  );
});

test('paceMinPerKmStackSecFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '09');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '09');
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '002');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '02');
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '009');
  });
  assert.strictEqual(runSubject.get('paceMinPerKmStackSecFixed'), '09');
});

test('paceMinPerKmStackSecFixed setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerKmStackSecFixed', '30');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '3630');
});

test('paceMinPerKmStackMin and paceMinPerKmStackSecFixed setter will define paceMinPerKm', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({
      paceMinPerKmStackMin: '5',
      paceMinPerKmStackSecFixed: '30'
    });
  });
  assert.strictEqual(runSubject.get('paceMinPerKm').toString(), '5.5');
});

// paceMinPerMi
test('paceMinPerMi property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(60),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '60');
});

test('paceMinPerMi can have up to 20 decimal places and can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.1234567891238),
    lengthMi: new BigNumber(900)
  });
  // http://keisan.casio.com/calculator results in 0.0012482853212486666666666667
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '0.00124828532124866667'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(1.1234567891238),
      lengthMi: new BigNumber(123)
    });
  });
  // http://keisan.casio.com/calculator results in 0.001248285321248666666667
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '0.00913379503352682927'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(13),
      lengthMi: new BigNumber(124)
    });
  });
  // http://keisan.casio.com/calculator results in 0.10483870967741935483870968
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '0.10483870967741935484'
  );
});

test('paceMinPerMi can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(3.1131567891211),
    lengthMi: new BigNumber(900)
  });
  // http://keisan.casio.com/calculator results in 0.0034590630990234444444444444
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '0.00345906309902344444'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(9),
      lengthMi: new BigNumber(124)
    });
  });
  // http://keisan.casio.com/calculator results in 0.072580645161290322580645161
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '0.07258064516129032258'
  );

  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(1245),
      lengthMi: new BigNumber(124)
    });
  });
  // http://keisan.casio.com/calculator results in 10.04032258064516129032 2581
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '10.04032258064516129032'
  );
});

test('paceMinPerMi is not getting infinite when length is zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(0)
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '0');
});

test('paceMinPerMi setter changes paceMinPerMi', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerMi', '21');
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '21');
});

test('paceMinPerMi setter can handle floats', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerMi', 2.2);
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '2.2');
  run(function() {
    runSubject.set('paceMinPerMi', '2.5');
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '2.5');
  run(function() {
    runSubject.set('paceMinPerMi', 2.21234);
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '2.21234');
});

test('paceMinPerMi setter also works with integer', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerMi', 21);
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '21');
});

test('paceMinPerMi setter changes timeSec', function(assert) {
  var runSubject = this.subject({ lengthMi: new BigNumber(8) });
  run(function() {
    runSubject.set('paceMinPerMi', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '960'); // 8mi with 2min/mi will take 16 min (960 sek)
});

test("paceMinPerMi setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2000) });
  run(function() {
    runSubject.set('paceMinPerMi', 21);
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2000');
});

// paceMinPerMiStackMin
test('paceMinPerMiStackMin property is calculated from lengthM', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.23454),
    lengthMi: new BigNumber(1)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '1');
});

test('paceMinPerMiStackMin property can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthMi: new BigNumber(1.5)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '0');
});

test('paceMinPerMiStackMin rounds properly', function(assert) {
  const runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthMi: new BigNumber(1)
  });

  run(function() {
    runSubject.set('paceMinPerMi', new BigNumber(0.992));
  });

  // 0 Minutes and 59.52 seconds translates to 0:59
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '1');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '0');

  run(function() {
    runSubject.set('paceMinPerMi', new BigNumber(0.991));
  });

  // 0 Minutes and 59.46 seconds translates to 0:59
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '0');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '59');
});

test('paceMinPerMiStackMin setter changes paceMinPerMiStackMin', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthMi: new BigNumber(2)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackMin', '12');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '12');
});

test('paceMinPerMiStackMin setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthMi: new BigNumber(2)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackMin', '5.5');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  run(function() {
    runSubject.set('paceMinPerMiStackMin', 2.3);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '2');
});

test('paceMinPerMiStackMin setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthMi: new BigNumber(2)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackMin', 12);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '12');
});

test('paceMinPerMiStackMin setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(60),
    lengthMi: new BigNumber(2)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackMin', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '300'); // 2mi with 2,5min/km will take 5 minutes (300 sek)
});

test("paceMinPerMiStackMin setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(270),
    lengthM: new BigNumber(2000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackMin', 12);
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2000');
});

// paceMinPerMiStackSec
test('paceMinPerMiStackSec property is calculated from timeMin and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.54),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '32'); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerMiStackSec property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.56),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '34'); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerMiStackSec rounds properly', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(1864),
    lengthM: new BigNumber(10000)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '0'); // was 59.9817216 before round()
});

test('paceMinPerMiStackSec can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthMi: new BigNumber(1)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '0');
});

test('paceMinPerMiStackSec setter changes paceMinPerMiStackSec', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', '10');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '10');
});

test('paceMinPerMiStackSec setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', '2.2');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '2');
  run(function() {
    runSubject.set('paceMinPerMiStackSec', 2.5);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '3');
});

test('paceMinPerMiStackSec setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', 2);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '2');
});

test('paceMinPerMiStackSec setter handles negative values and changes paceMinPerMiStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', -10);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '4');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '50');
});

test('paceMinPerMiStackSec setter handles values over 59 and changes paceMinPerMiStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', 60);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '0');
  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSec', 80);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '20');
});

test('paceMinPerMiStackSec handles 59 fractions without rounding while paceMinPerMiStackSecRaw does not', function(assert) {
  const runSubject = this.subject({
    timeSec: new BigNumber(1200),
    lengthM: new BigNumber(8050.72) // a bit more than 5 miles
  });

  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '4');

  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecRaw').toString(),
    '59.880756006916151598863208'
  );

  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '0');
});

test('paceMinPerMiStackSec setter influences all pace related properties', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(12),
    lengthMi: new BigNumber(2)
  }); // 6 min/mi
  run(function() {
    runSubject.set('paceMinPerMiStackSec', '20');
  }); // 6.3333 min/km
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '20');
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '6.33333333333333333333'
  );
});

test('paceMinPerMiStackSec setter handles values bigger than 59', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(12),
    lengthMi: new BigNumber(2)
  }); // 6 min/mi
  run(function() {
    runSubject.set('paceMinPerMiStackSec', '90');
  }); // 7.5 min/km
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '7'); // 6 flips to 7 because a paceMinPerMiStackSec of 90 flips the paceMinPerMiStackMin
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '30');
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '7.5');
});

test('paceMinPerMiStackSec setter should refer to an uncompressed version paceMinPerMiStackSec (with digits) to have exact results', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600 * 4),
    lengthM: new BigNumber(42195)
  });
  // paceMinPerMiStackSec is calculated from the previous paceMinPerMiStackSec
  // Since this value is normally rounded, it should be used in uncompressed form for calculation

  // In this example paceMinPerMi is currently 9.15375186633487380021
  assert.strictEqual(
    runSubject.get('paceMinPerMi').toString(),
    '9.15375186633487380021'
  );

  // which results in a paceMinPerMiStackSec of 09
  assert.strictEqual(runSubject.get('paceMinPerMiStackSec').toString(), '9');

  // actually it is 9.2251119800924280126 (0.15375186633487380021*60)
  // when setting paceMinPerMiStackSec
  run(function() {
    runSubject.set('paceMinPerMiStackSec', '0');
  });
  // it should refer to 9.2251119800924280126 and not 9 to result in 9 (aka 9.00) instead of 9.00375186633487380021
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '9');
});

// paceMinPerMiStackSecFixed
test('paceMinPerMiStackSecFixed property property is calculated from timeMin and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.54),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '32'
  ); // 60 * 0,54 = 32,4 seconds
});

test('paceMinPerMiStackSecFixed property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.56),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '34'
  ); // 60 * 0,56 = 33,6 seconds
});

test('paceMinPerMiStackSecFixed has leading zero(s)', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(75.083),
    lengthMi: new BigNumber(1)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '05');
  run(function() {
    runSubject.setProperties({
      timeMin: new BigNumber(75),
      lengthMi: new BigNumber(1)
    });
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '00');
});

test('paceMinPerMiStackSecFixed can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(60),
    lengthMi: new BigNumber(1)
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '00');
});

test('paceMinPerMiStackSecFixed setter changes paceMinPerMiStackSecFixed', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '10');
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '10'
  );
});

test('paceMinPerMiStackSecFixed setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '2.2');
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '02'
  );
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', 2.5);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '03'
  );
});

test('paceMinPerMiStackSecFixed setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', 12);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '12'
  );
});

test('paceMinPerMiStackSecFixed setter works with single digit', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1.5),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', 2);
  });
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '02'
  );
});

test('paceMinPerMiStackSecFixed setter handles negative values and changes paceMinPerMiStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', -10);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '4');
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '50'
  );

  run(function() {
    runSubject.set('paceMinPerMi', '5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', -1);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '4');
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '59'
  );
});

test('paceMinPerMiStackSecFixed setter handles values over 59 and changes paceMinPerMiStackMin', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', 60);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('paceMinPerMi', '5.5');
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', 80);
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackMin').toString(), '6');
  assert.strictEqual(
    runSubject.get('paceMinPerMiStackSecFixed').toString(),
    '20'
  );
});

test('paceMinPerMiStackSecFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '09');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '09');
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '002');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '02');
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '009');
  });
  assert.strictEqual(runSubject.get('paceMinPerMiStackSecFixed'), '09');
});

test('paceMinPerMiStackSecFixed setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.set('paceMinPerMiStackSecFixed', '30');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '3630');
});

test('paceMinPerMiStackMin and paceMinPerMiStackSecFixed setter will define paceMinPerMi', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthMi: new BigNumber(1)
  });
  run(function() {
    runSubject.setProperties({
      paceMinPerMiStackMin: '5',
      paceMinPerMiStackSecFixed: '30'
    });
  });
  assert.strictEqual(runSubject.get('paceMinPerMi').toString(), '5.5');
});

// speedKmHr
test('speedKmHr property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(1500)
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '0.75');
});

test('speedKmHr can have up to 20 decimal places and can round up', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(11),
    lengthM: new BigNumber(23.4511)
  });
  // http://keisan.casio.com/calculator results in 7.6749054545454545454545455
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '7.67490545454545454545'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(11),
      lengthM: new BigNumber(23.451)
    });
  });
  // http://keisan.casio.com/calculator results in 7.6748727272727272727272727
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '7.67487272727272727273'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(11),
      lengthM: new BigNumber(12.121)
    });
  });
  // http://keisan.casio.com/calculator results in 3.9668727272727272727272727
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '3.96687272727272727273'
  );
});

test('speedKmHr can round down', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(49),
    lengthM: new BigNumber(12.9912)
  });
  // http://keisan.casio.com/calculator results in 0.9544555102040816326531
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '0.95445551020408163265'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(11),
      lengthM: new BigNumber(12.9912)
    });
  });
  // http://keisan.casio.com/calculator results in 4.2516654545454545454545455
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '4.25166545454545454545'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(11),
      lengthM: new BigNumber(23.9912)
    });
  });
  // http://keisan.casio.com/calculator results in 7.8516654545454545454545455
  assert.strictEqual(
    runSubject.get('speedKmHr').toString(),
    '7.85166545454545454545'
  );
});

test('speedKmHr is not getting infinite when time is zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(0),
    lengthM: new BigNumber(123456)
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '0');
});

test('speedKmHr setter changes speedKmHr', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('speedKmHr', '21');
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '21');
});

test('speedKmHr setter can handle floats', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('speedKmHr', 2.2);
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '2.2');
  run(function() {
    runSubject.set('speedKmHr', '2.5');
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '2.5');
  run(function() {
    runSubject.set('speedKmHr', 2.21234);
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '2.21234');
});

test('speedKmHr setter also works with integer', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('speedKmHr', 2);
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '2');
});

test('speedKmHr setter changes timeSec', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(8000) });
  run(function() {
    runSubject.set('speedKmHr', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '14400'); // 8km with 2km/hr will take 4 hours (14400 sek)
});

test("speedKmHr setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(2500) });
  run(function() {
    runSubject.set('speedKmHr', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2500');
});

// speedKmHrStackKm
test('speedKmHrStackKm property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(25000)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '25');
});

test('speedKmHrStackKm property can be zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(1500)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '0');
});

test('speedKmHrStackKm property can be zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(1)
  });

  run(function() {
    runSubject.set('speedKmHr', new BigNumber(0.995));
  }); // the speedKmHr of 0.995 results in a speedKmHrStackKm of 1
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '1');

  run(function() {
    runSubject.set('speedKmHr', new BigNumber(0.994));
  }); // the speedKmHr of 0.994 results in a speedKmHrStackKm of 0
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '0');
});

test('speedKmHrStackKm setter changes speedKmHrStackKm', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24000)
  });
  run(function() {
    runSubject.set('speedKmHrStackKm', '18');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '18');
});

test('speedKmHrStackKm setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24000)
  });
  run(function() {
    runSubject.set('speedKmHrStackKm', '5.5');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '6');
  run(function() {
    runSubject.set('speedKmHrStackKm', 2.3);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '2');
});

test('speedKmHrStackKm setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24123)
  });
  run(function() {
    runSubject.set('speedKmHrStackKm', 12);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '12');
});

test('speedKmHrStackKm setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(8000)
  });
  run(function() {
    runSubject.set('speedKmHrStackKm', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '14400'); // 8km with 2km/hr will take 4 hours (14400 sek)
});

test("speedKmHrStackKm setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(2500)
  });
  run(function() {
    runSubject.set('speedKmHrStackKm', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2500');
});

// speedKmHrStackDecimal
test('speedKmHrStackDecimal property is calculated from timeSec and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(25123)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '12');
});

test('speedKmHrStackDecimal property can round up', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(25125)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '13');
});

test('speedKmHrStackDecimal can have 1 digit', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12800)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '8');
});

test('speedKmHrStackDecimal supports leading zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12012)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '01');
});

test('speedKmHrStackDecimal can be zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '0');
});

test('speedKmHrStackDecimal setter changes speedKmHrStackDecimal', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '9');
});

test('speedKmHrStackDecimal setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '8.2');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '8');
  run(function() {
    runSubject.set('speedKmHrStackDecimal', 8.5);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '9');
});

test('speedKmHrStackDecimal setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', 9);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '9');
});

test('speedKmHrStackDecimal setter handles negative values and changes speedKmHrStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHr', '5.5');
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', -10);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '4');
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal').toString(), '9');
});

test('speedKmHrStackDecimal setter handles values over 99 and changes speedKmHrStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHr', '5.5');
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', 100);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '5');
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal').toString(), '1');

  run(function() {
    runSubject.set('speedKmHr', '5.5');
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', 123);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '5');
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal').toString(), '12');
});

test('speedKmHrStackDecimal setter works with leading zeros', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '09');
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '002');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '0');
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '009');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimal'), '01');
});

test('speedKmHrStackDecimal setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(3000)
  });
  run(function() {
    runSubject.setProperties({
      speedKmHrStackKm: '1',
      speedKmHrStackDecimal: '5'
    });
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '7200'); // 3km with 1,5km/hr will take 2 hours (7200 sek)
});

test("speedKmHrStackDecimal setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12000');
});

test('speedKmHrStackKm and speedKmHrStackDecimal setter will define speedKmHr', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(4400)
  });
  run(function() {
    runSubject.setProperties({
      speedKmHrStackKm: '12',
      speedKmHrStackDecimal: '05'
    });
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '12.05');
});

// speedKmHrStackDecimalFixed
test('speedKmHrStackDecimalFixed property is calculated from speedKmHr and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(12.121) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '12');
});

test('speedKmHrStackDecimalFixed property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(12.715) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '72');
});

test('speedKmHrStackDecimalFixed has trailing zero(s)', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(0.5) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '50');
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(5) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '00');
});

test('speedKmHrStackDecimalFixed supports leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(0.09) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '09');
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(0.005) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '01');
});

test('speedKmHrStackDecimalFixed can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedKmHr: new BigNumber(99) });
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '00');
});

test('speedKmHrStackDecimalFixed setter changes speedKmHrStackDecimalFixed', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '90');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '90');
});

test('speedKmHrStackDecimalFixed setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '80');
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '10');
});

test('speedKmHrStackDecimalFixed setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', 9);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '90');
});

test('speedKmHrStackDecimalFixed setter works with single digit', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '9');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '90');
});

test('speedKmHrStackDecimalFixed setter handles negative values and changes speedKmHrStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedKmHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', -10);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '4');
  assert.strictEqual(
    runSubject.get('speedKmHrStackDecimalFixed').toString(),
    '90'
  );

  run(function() {
    runSubject.set('speedKmHr', new BigNumber('5.0'));
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', -1);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '4');
  assert.strictEqual(
    runSubject.get('speedKmHrStackDecimalFixed').toString(),
    '99'
  );
});

test('speedKmHrStackDecimalFixed setter handles values over 99 and changes speedKmHrStackKm', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedKmHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', 100);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '6');
  assert.strictEqual(
    runSubject.get('speedKmHrStackDecimalFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('speedKmHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', 123);
  });
  assert.strictEqual(runSubject.get('speedKmHrStackKm').toString(), '6');
  assert.strictEqual(
    runSubject.get('speedKmHrStackDecimalFixed').toString(),
    '23'
  );
});

test('speedKmHrStackDecimalFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '002');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '00');
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '009');
  });
  assert.strictEqual(runSubject.get('speedKmHrStackDecimalFixed'), '01');
});

test('speedKmHrStackDecimalFixed setter changes speedKmHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedKmHr', '1000');
  });
  run(function() {
    runSubject.set('speedKmHrStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '1000.09');
});

test('speedKmHrStackKm and speedKmHrStackDecimalFixed setter will define speedKmHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.setProperties({
      speedKmHrStackKm: '12',
      speedKmHrStackDecimalFixed: '9'
    });
  });
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '12.9');
});

// speedMiHr
test('speedMiHr property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1609.344)
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '1');
});

test('speedMiHr can have up to 20 decimal places and can round up', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1629.364239)
  });
  // http://keisan.casio.com/calculator results in 1.0124399997763063707945598
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '1.01243999977630637079'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(3600),
      lengthM: new BigNumber(1629.380333)
    });
  });
  // http://keisan.casio.com/calculator results in 1.0124500001242742384474668
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '1.01245000012427423845'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(3600),
      lengthM: new BigNumber(1629.380322)
    });
  });
  // http://keisan.casio.com/calculator results in 1.0124499932891911238367931
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '1.01244999328919112384'
  );
});

test('speedMiHr property can round up', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1629.380999)
  });
  // http://keisan.casio.com/calculator results in 1.0124504139574882685118906
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '1.01245041395748826851'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(3600),
      lengthM: new BigNumber(1721)
    });
  });
  // http://keisan.casio.com/calculator results in 1.0693798218404517617116042
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '1.06937982184045176171'
  );

  run(function() {
    runSubject.setProperties({
      timeSec: new BigNumber(3600),
      lengthM: new BigNumber(12345.12)
    });
  });
  // http://keisan.casio.com/calculator results in 7.6709019327129563350035791
  assert.strictEqual(
    runSubject.get('speedMiHr').toString(),
    '7.670901932712956335'
  ); // two zeros at the end are falling away
});

test('speedMiHr is not getting infinite when time is zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(0),
    lengthM: new BigNumber(123456)
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '0');
});

test('speedMiHr setter changes speedMiHr', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('speedMiHr', '2');
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '2');
});

test('speedMiHr setter can handle floats', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1609.344) });
  run(function() {
    runSubject.set('speedMiHr', 2.2);
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '2.2');
  run(function() {
    runSubject.set('speedMiHr', '2.5');
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '2.5');
  run(function() {
    runSubject.set('speedMiHr', 2.21234);
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '2.21234');
});

test('speedMiHr setter also works with integer', function(assert) {
  var runSubject = this.subject({ lengthM: new BigNumber(1000) });
  run(function() {
    runSubject.set('speedMiHr', 2);
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '2');
});

test('speedMiHr setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(6437.376)
  });
  run(function() {
    runSubject.set('speedMiHr', '2');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '7200'); // 4mi with 2mi/hr will take 2 hours (7200 sek)
});

test("speedMiHr setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(6437.376)
  });
  run(function() {
    runSubject.set('speedMiHr', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '6437.376');
});

// speedMiHrStackMi
test('speedMiHrStackMi property is calculated from timeSec and lengthM', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(4000)
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '2');
});

test('speedMiHrStackMi property can be zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1000)
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '0');
});

test('speedMiHrStackMi rounds properly', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1)
  });

  run(function() {
    runSubject.set('speedMiHr', new BigNumber(0.995));
  }); // a speedMiHr of 0.995 results in a speedMiHrStackMi of 1
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '1');

  run(function() {
    runSubject.set('speedMiHr', new BigNumber(0.994));
  }); // a speedMiHr of 0.994 results in a speedMiHrStackMi of 0
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '0');
});

test('speedMiHrStackMi setter changes speedMiHrStackMi', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24000)
  });
  run(function() {
    runSubject.set('speedMiHrStackMi', '18');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '18');
});

test('speedMiHrStackMi setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24000)
  });
  run(function() {
    runSubject.set('speedMiHrStackMi', '5.5');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '6');
  run(function() {
    runSubject.set('speedMiHrStackMi', 2.3);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '2');
});

test('speedMiHrStackMi setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(24123)
  });
  run(function() {
    runSubject.set('speedMiHrStackMi', 12);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '12');
});

test('speedMiHrStackMi setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(6437.376)
  });
  run(function() {
    runSubject.set('speedMiHrStackMi', '4');
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '3600'); // 4mi with 4mi/hr will take 1 hour (3600 sek)
});

test("speedMiHrStackMi setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(2500)
  });
  run(function() {
    runSubject.set('speedMiHrStackMi', '12');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '2500');
});

// speedMiHrStackDecimal
test('speedMiHrStackDecimal property is calculated from timeSec and lengthM and can round down', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(2500.920576)
  }); // 1.554 mi
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '55');
});

test('speedMiHrStackDecimal property can round up', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(2502.52992)
  }); // 1.555 mi
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '56');
});

test('speedMiHrStackDecimal can have 1 digit', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(2414.02)
  }); // 1.5 mi
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '5');
});

test('speedMiHrStackDecimal supports leading zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1689.811)
  }); // 1.05 mi
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '05');
});

test('speedMiHrStackDecimal can be zero', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(1609.34)
  }); // 1.00 mi
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '0');
});

test('speedMiHrStackDecimal setter changes speedMiHrStackDecimal', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '9');
});

test('speedMiHrStackDecimal setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '8.2');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '8');
  run(function() {
    runSubject.set('speedMiHrStackDecimal', 8.5);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '9');
});

test('speedMiHrStackDecimal setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', 9);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '9');
});

test('speedMiHrStackDecimal setter handles negative values and changes speedMiHrStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHr', '5.5');
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', -10);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '4');
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal').toString(), '9');
});

test('speedMiHrStackDecimal setter handles values over 99 and changes speedMiHrStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHr', '5.5');
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', 100);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '5');
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal').toString(), '1');

  run(function() {
    runSubject.set('speedMiHr', '5.5');
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', 123);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '5');
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal').toString(), '12');
});

test('speedMiHrStackDecimal setter works with leading zeros', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '09');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '09');
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '002');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '0');
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '009');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimal'), '01');
});

test('speedMiHrStackDecimal setter changes timeSec', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(4828.032)
  });
  run(function() {
    runSubject.setProperties({
      speedMiHrStackMi: '1',
      speedMiHrStackDecimal: '5'
    });
  });
  assert.strictEqual(runSubject.get('timeSec').toString(), '7200'); // 3m with 1,5m/hr will take 2 hours (7200 sek)
});

test("speedMiHrStackDecimal setter doesn't change lengthM", function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(3600),
    lengthM: new BigNumber(12000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimal', '9');
  });
  assert.strictEqual(runSubject.get('lengthM').toString(), '12000');
});

test('speedMiHrStackMi and speedMiHrStackDecimal setter will define speedMiHr', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(7200),
    lengthM: new BigNumber(4400)
  });
  run(function() {
    runSubject.setProperties({
      speedMiHrStackMi: '12',
      speedMiHrStackDecimal: '05'
    });
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '12.05');

  run(function() {
    runSubject.setProperties({
      speedMiHrStackMi: '12',
      speedMiHrStackDecimal: '04'
    });
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '12.04');

  run(function() {
    runSubject.setProperties({
      speedMiHrStackMi: '1',
      speedMiHrStackDecimal: '04'
    });
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '1.04');
});

// speedMiHrStackDecimalFixed
test('speedMiHrStackDecimalFixed property is calculated from speedMiHr and can round down', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(12.121) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '12');
});

test('speedMiHrStackDecimalFixed property can round up', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(12.715) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '72');
});

test('speedMiHrStackDecimalFixed has trailing zero(s)', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(0.5) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '50');
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(5) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '00');
});

test('speedMiHrStackDecimalFixed supports leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(0.09) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '09');
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(0.005) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '01');
});

test('speedMiHrStackDecimalFixed can be zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.setProperties({ speedMiHr: new BigNumber(99) });
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '00');
});

test('speedMiHrStackDecimalFixed setter changes speedMiHrStackDecimalFixed', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '90');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '90');
});

test('speedMiHrStackDecimalFixed setter can handle floats', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '8.2');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '80');
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', 9.5);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '10');
});

test('speedMiHrStackDecimalFixed setter also works with integer', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', 9);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '90');
});

test('speedMiHrStackDecimalFixed setter works with single digit', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '9');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '90');
});

test('speedMiHrStackDecimalFixed setter handles negative values and changes speedMiHrStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedMiHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', -10);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '4');
  assert.strictEqual(
    runSubject.get('speedMiHrStackDecimalFixed').toString(),
    '90'
  );

  run(function() {
    runSubject.set('speedMiHr', new BigNumber('5.0'));
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', -1);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '4');
  assert.strictEqual(
    runSubject.get('speedMiHrStackDecimalFixed').toString(),
    '99'
  );
});

test('speedMiHrStackDecimalFixed setter handles values over 99 and changes speedMiHrStackMi', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedMiHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', 100);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '6');
  assert.strictEqual(
    runSubject.get('speedMiHrStackDecimalFixed').toString(),
    '00'
  );

  run(function() {
    runSubject.set('speedMiHr', new BigNumber('5.5'));
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', 123);
  });
  assert.strictEqual(runSubject.get('speedMiHrStackMi').toString(), '6');
  assert.strictEqual(
    runSubject.get('speedMiHrStackDecimalFixed').toString(),
    '23'
  );
});

test('speedMiHrStackDecimalFixed setter works with leading zero', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber(1000)
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '09');
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '002');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '00');
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '009');
  });
  assert.strictEqual(runSubject.get('speedMiHrStackDecimalFixed'), '01');
});

test('speedMiHrStackDecimalFixed setter changes speedMiHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.set('speedMiHr', '123');
  });
  run(function() {
    runSubject.set('speedMiHrStackDecimalFixed', '09');
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '123.09');
});

test('speedMiHrStackMi and speedMiHrStackDecimalFixed setter will define speedMiHr', function(assert) {
  var runSubject = this.subject({
    timeMin: new BigNumber(1),
    lengthM: new BigNumber('1000')
  });
  run(function() {
    runSubject.setProperties({
      speedMiHrStackMi: '12',
      speedMiHrStackDecimalFixed: '9'
    });
  });
  assert.strictEqual(runSubject.get('speedMiHr').toString(), '12.9');
});

// some edge cases found during development
test('speedKmHr accuracy edge case was fixed', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(23.4511)
  });
  // older version of speedKmHr getter resulted in 2.81413200000000000113
  // problem was fixed by optmizing the calculation by eleminating a dividedBy call
  assert.strictEqual(runSubject.get('speedKmHr').toString(), '2.814132');
});

test('timeStackSecFixed setter changes timeMin', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber('3599.9999999999999999999999994')
  });
  assert.strictEqual(runSubject.get('timeStackSecFixed').toString(), '00'); // became 0-0 because of missing typecast
});

test('Rounding issue found by Dominik Wild', function(assert) {
  const runSubject = this.subject({
    timeSec: new BigNumber(1200),
    lengthM: new BigNumber(5007.68)
  });
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '3.9938654227107163397'
  );

  assert.strictEqual(runSubject.get('paceMinPerKmStackMin').toString(), '4'); // this was 3
  assert.strictEqual(runSubject.get('paceMinPerKmStackMinRaw').toString(), '4'); // this was 3

  assert.strictEqual(runSubject.get('paceMinPerKmStackSec').toString(), '0');
  assert.strictEqual(
    runSubject.get('paceMinPerKmStackSecRaw').toString(),
    '59.631925362642980382133044'
  );
  assert.strictEqual(
    runSubject.get('paceMinPerKm').toString(),
    '3.9938654227107163397'
  );
});

// splits
test('splits is a relation to splits model', function(assert) {
  const run = this.store().modelFor('run');
  const relationship = get(run, 'relationshipsByName').get('splits');
  assert.equal(relationship.key, 'splits');
  assert.equal(relationship.kind, 'belongsTo');
  assert.equal(relationship.type, 'splits');
});

// isInRange
test('isInRange returns true if the run is in the specific range', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(23.4511)
  });
  assert.strictEqual(runSubject.isInRange(23, 24), true);
});

test('isInRange returns false if the run is not in the specific range', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(23.4511)
  });
  assert.strictEqual(runSubject.isInRange(25, 28), false);
});

test('isInRange can deal with BigNumber input', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(23.4511)
  });
  assert.strictEqual(
    runSubject.isInRange(new BigNumber(12), new BigNumber(23.5)),
    true
  );
  assert.strictEqual(
    runSubject.isInRange(new BigNumber(32), new BigNumber(43)),
    false
  );
});

test('isInRange only returns true if the range is given in the right order', function(assert) {
  var runSubject = this.subject({
    timeSec: new BigNumber(30),
    lengthM: new BigNumber(12)
  });
  assert.strictEqual(
    runSubject.isInRange(new BigNumber(11), new BigNumber(13)),
    true
  );
  assert.strictEqual(
    runSubject.isInRange(new BigNumber(13), new BigNumber(11)),
    false
  );
});

// private helper methods
test('_getLeadingZerosFromString returns the amount of leading zeros a string has', function(assert) {
  assert.strictEqual(this.subject()._getLeadingZerosFromString('0001'), 3);
  assert.strictEqual(this.subject()._getLeadingZerosFromString('knkrdngkr'), 0);
});

test('_ensureBigNumber can handle numeric strings', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber('1');
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), '1');

  ensureBigNumber = this.subject()._ensureBigNumber('1.1');
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), '1.1');
});

test('_ensureBigNumber can handle floats', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber(1.1);
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), '1.1');
});

test('_ensureBigNumber will leave BigNumber input unchanged', function(assert) {
  var bigNumber = new BigNumber(1.23456);
  var ensureBigNumber = this.subject()._ensureBigNumber(bigNumber);
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), '1.23456');
  assert.strictEqual(ensureBigNumber, bigNumber);
});

test('_ensureBigNumber will treat non numeric input as 0', function(assert) {
  var ensureBigNumber = this.subject()._ensureBigNumber(
    'dumb user input from a random hacker kid'
  );
  assert.strictEqual(ensureBigNumber instanceof BigNumber, true);
  assert.strictEqual(ensureBigNumber.toString(), '0');
});
