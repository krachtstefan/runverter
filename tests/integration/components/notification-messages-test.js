import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('notification-messages', 'Integration | Component | notification messages', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{notification-messages}}`);
  assert.equal(this.$('div').attr('id'), 'notification-container', 'wrapper container found');
});
