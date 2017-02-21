import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('control-panel', 'Integration | Component | control panel', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{control-panel}}`);
  assert.equal(this.$('div').attr('class'), 'control-panel ember-view', 'wrapper container found');
});
