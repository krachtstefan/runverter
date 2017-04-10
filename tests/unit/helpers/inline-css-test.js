import { inlineCSS } from 'runverter/helpers/inline-css';
import { module, test } from 'qunit';

module('Unit | Helper | inline css');

test('inline css returns a SafeString object', function(assert) {
  let result = inlineCSS([], {});
  assert.strictEqual(result.constructor.name, "SafeString");

  result = inlineCSS([], {value:"value"});
  assert.strictEqual(result.constructor.name, "SafeString");

  result = inlineCSS([], {property:"property"});
  assert.strictEqual(result.constructor.name, "SafeString");

  result = inlineCSS([], { property : "font-size", value: "12"});
  assert.strictEqual(result.constructor.name, "SafeString");
});

test('inline css returns an empty string if no property and/or value are set', function(assert) {
  let result = inlineCSS([], {});
  assert.strictEqual(result.toString(), "");

  result = inlineCSS([], {value:"value"});
  assert.strictEqual(result.toString(), "");

  result = inlineCSS([], {property:"property"});
  assert.strictEqual(result.toString(), "");
});

test('inline css returns a CSS string if property and value are set', function(assert) {
  let result = inlineCSS([], { property : "font-size", value: "12"});
  assert.strictEqual(result.toString(), "font-size:12;");
});

test('inline css adds a post value', function(assert) {
  let result = inlineCSS([], { property : "font-size", value: "12", post:"px"});
  assert.strictEqual(result.toString(), "font-size:12px;");
});

test('inline css adds a pre value', function(assert) {
  let result = inlineCSS([], { property : "color", value: "ffffff", pre:"#"});
  assert.strictEqual(result.toString(), "color:#ffffff;");
});
