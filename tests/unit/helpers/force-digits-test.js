import { forceDigits } from 'runverter/helpers/force-digits';
import { module, test } from 'qunit';

module('Unit | Helper | force digits');

test('force-digits returns a string', function(assert) {
  let result = forceDigits([], {value: ""});
  assert.strictEqual(typeof result, "string");
});

test('force-digits fills a string to match the required length', function(assert) {
  let result = forceDigits([], {value: "12", length: 3});
  assert.strictEqual(result.length, 3);
});

test('force-digits has a default length of 2', function(assert) {
  let result = forceDigits([], {value: "1"});
  assert.strictEqual(result.length, 2);
});

test('force-digits doesn\'t fill the string if the required length is already fulfilled', function(assert) {
  let result = forceDigits([], {value: "1234", length: 3});
  assert.strictEqual(result.length, 4);
});

test('force-digits appends with 0 by default', function(assert) {
  let result = forceDigits([], {value: "12", length: 3});
  assert.strictEqual(result[2], "0");
});

test('force-digits appends with 0 by default', function(assert) {
  let result = forceDigits([], {value: "12", length: 3});
  assert.strictEqual(result[0], "1");
  assert.strictEqual(result[2], "0");
});

test('force-digits prepends if mode is definded', function(assert) {
  let result = forceDigits([], {value: "12", length: 3, mode: "prepend"});
  assert.strictEqual(result[0], "0");
  assert.strictEqual(result[2], "2");
});

test('force-digits can use a custom filler string', function(assert) {
  let result = forceDigits([], {value: "1", filler: "x"});
  assert.strictEqual(result[1], "x");
});
