import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('suggest-select', 'Integration | Component | suggest select', {
  integration: true
});

test('it renders', function(assert) {
  this.set('races', [{
    "name" : "name",
    'lengthM' : new BigNumber(10000)
  }]);

  this.render(hbs`{{form-helper/suggest-select
    items=races
  }}`);

  assert.equal(this.$('div').attr('class'), 'suggest-select ember-view', 'wrapper container found');
});
