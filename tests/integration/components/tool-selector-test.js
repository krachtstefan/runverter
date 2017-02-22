import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-selector', 'Integration | Component | tool selector', {
  integration: true
});

test('it renders', function(assert) {
  this.set('selectItems', [{
    "key" : "key",
    "name" : "name",
    "label" : "label",
    "description" : "description",
  }]);

  this.render(hbs`{{tool-selector
    menuItems=selectItems
  }}`);

  assert.equal(this.$('select').attr('class'), 'menu x-select ember-view', 'select tag found');
});
