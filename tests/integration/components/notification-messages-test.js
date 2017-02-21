import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { make, manualSetup }  from 'ember-data-factory-guy';

moduleForComponent('notification-messages', 'Integration | Component | notification messages', {
  integration: true,
  beforeEach: function () {
    manualSetup(this.container);
  }
});

test('it renders', function(assert) {
  this.set('run', make('run'));

  this.render(hbs`{{notification-messages}}`);

  assert.equal(this.$('div').attr('id'), 'notification-container', 'wrapper container found');
});
