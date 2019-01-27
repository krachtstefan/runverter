import Component from '@ember/component';
import $ from 'jquery';
import { run } from '@ember/runloop';

export default Component.extend({
  didInsertElement: function() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, function() {
      $('select.menu')
        .selectOrDie({ customID: 'menu' })
        .ready(function() {
          $('select.menu').selectOrDie('update'); // need to trigger update to select the correct initial value
        });
    });
  },

  didRender: function() {
    this._super(...arguments);
    // ensure selectOrDie update on language change
    run.scheduleOnce('afterRender', this, function() {
      $('select.menu').selectOrDie('update');
    });
  }
});
