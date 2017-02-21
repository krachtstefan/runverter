import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { make, manualSetup }  from 'ember-data-factory-guy';

moduleForComponent('pace-calculator', 'Integration | Component | pace calculator', {
  integration: true,
  beforeEach: function () {
    manualSetup(this.container);
  }
});

test('it renders', function(assert) {
  this.set('run', make('run'));

  this.render(hbs`{{pace-calculator
    run=run
  }}`);

  assert.equal(this.$('form').attr('class'), 'uk-form uk-container-center', 'form tag found');
});
