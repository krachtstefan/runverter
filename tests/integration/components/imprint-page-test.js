import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('imprint-page', 'Integration | Component | imprint page', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{imprint-page}}`);
  assert.equal(this.$('div').attr('class'), 'imprint ember-view', 'wrapper container found');
});
