import DS from 'ember-data';
// import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

moduleForModel('settings', 'Settings Model');

test('settings is a valid ember data Model', function(assert) {
  var settings = this.subject();
  assert.ok(settings);
  assert.ok(settings instanceof DS.Model);
});
