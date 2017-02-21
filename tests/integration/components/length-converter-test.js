import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { make, manualSetup }  from 'ember-data-factory-guy';

moduleForComponent('length-converter', 'Integration | Component | length converter', {
  integration: true,
  beforeEach: function () {
    manualSetup(this.container);
  }
});

test('it renders', function(assert) {
  this.set('run', make('run'));

  this.render(hbs`{{length-converter
    run=run
  }}`);

  assert.equal(this.$('form').attr('class'), 'uk-form uk-container-center', 'form tag found');
});
