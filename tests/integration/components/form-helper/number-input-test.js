import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('number-input', 'Integration | Component | number input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('value', 12);

  this.render(hbs`{{form-helper/number-input
    value=value
  }}`);

  assert.equal(this.$('input').attr('class'), 'digits-2 ember-view', 'input tag found');
});
