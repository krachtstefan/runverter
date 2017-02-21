import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { make, manualSetup }  from 'ember-data-factory-guy';

moduleForComponent('control-panel', 'Integration | Component | control panel', {
  integration: true,
  beforeEach: function () {
    manualSetup(this.container);
  }
});

test('it renders', function(assert) {
  this.set('run', make('run'));

  this.render(hbs`{{control-panel}}`);

  assert.equal(this.$('div').attr('class'), 'control-panel ember-view', 'wrapper container found');
});
