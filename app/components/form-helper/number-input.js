import OneWayTel from './../one-way-tel';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { observer } from '@ember/object';

export default OneWayTel.extend({
  attributeBindings: ['autocomplete'],
  classNameBindings: ['widthClassName'],
  autocomplete: 'off',
  addLeadingZeros: false,
  minLength: 2, // used for input width
  maxLength: 2, // used for value handling
  lastCursorPosition: null,
  widthClassName: null, // class name that handles the with via css
  focus: false,

  DOMinputField: computed(function() {
    return this.$();
  }).volatile(),

  DOMinputValue: computed(function() {
    return this.get('DOMinputField').val();
  }).volatile(),

  DOMinputFieldLength: computed(function() {
    return this.get('DOMinputField').val().length;
  }).volatile(),

  selectionStart: computed(function() {
    return this.get('DOMinputField').prop('selectionStart');
  }).volatile(),

  selectionEnd: computed(function() {
    return this.get('DOMinputField').prop('selectionEnd');
  }).volatile(),

  allSelected: computed(function() {
    return (
      this.get('selectionEnd') - this.get('selectionStart') >=
      this.get('DOMinputFieldLength')
    );
  }).volatile(),

  somethingSelected: computed(function() {
    return this.get('selectionEnd') - this.get('selectionStart') > 0;
  }).volatile(),

  selection: computed(function() {
    return this.get('DOMinputValue').slice(
      this.get('selectionStart'),
      this.get('selectionEnd')
    );
  }).volatile(),

  preSelection: computed(function() {
    return this.get('DOMinputValue').slice(0, this.get('selectionStart'));
  }).volatile(),

  postSelection: computed(function() {
    return this.get('DOMinputValue').slice(
      this.get('selectionEnd'),
      this.get('DOMinputValue').length
    );
  }).volatile(),

  isTouchDevice: computed(function() {
    return 'ontouchstart' in document.documentElement;
  }),

  init: function() {
    this._super(...arguments);
    this.removeLengthBindings();
    this.handleWidthClassName();
  },

  input() {
    this._super(...arguments);
    var lastValue = this.get('value'); // current value in model
    var currentValue = this.readDOMAttr('value'); // current value in DOM
    var nextValue = currentValue; // future value in DOM
    var cursorPosition = this.get('selectionStart');
    var maxLength = parseInt(this.get('maxLength'));

    // if the inputs new value would exceed the allowed maxLength
    if (nextValue.length > maxLength) {
      var nextValueArr = nextValue.split('');
      var spaceLeft = maxLength - cursorPosition; // defines how many positions the curser has left before exceeding the max value
      var offset = spaceLeft < 0 ? spaceLeft - 1 : 0; // use spaceLeft to calculate the offset for the splice function
      nextValueArr.splice(cursorPosition + offset, 1); // extract the part of the old value that, should be overwritten by the new value
      nextValueArr.splice(maxLength); // make sure not to exceed the maxLength (fe. if someone pastes multiple characters at once)
      nextValue = nextValueArr.join('');
    }

    // Prevent an issue for values that automatically get a leading zero
    // Example: after selecting the whole input value and typing a number like 12, the value would become 02 instead of 12 (first 01 and then 02)
    if (
      this.lastCursorPosition && // if the cursor changed
      cursorPosition === parseInt(this.get('maxLength')) + 1 && // and is placed at the last position
      cursorPosition !== this.lastCursorPosition && // for the first time
      lastValue[0] === '0' // and the previous value started with a zero
    ) {
      nextValue = parseInt(lastValue) + '' + parseInt(nextValue);
    }

    this.set('value', nextValue);
    this.lastCursorPosition = cursorPosition;
    return true;
  },

  keyDown(event) {
    var hotkeyPressed =
      event.ctrlKey === true || event.shiftKey === true || event.altKey === true
        ? true
        : false;
    var steppSize = hotkeyPressed === true ? 10 : 1;
    switch (event.keyCode) {
      case 38: // up
        event.preventDefault();
        this.send('increaseValue', steppSize);
        break;
      case 40: // down
        event.preventDefault();
        this.send('decreaseValue', steppSize);
        break;
      case 8: // backspace
        this.handleBackspace(event);
        break;
    }
    return true;
  },

  focusIn(event) {
    run.later(
      this,
      function() {
        this.selectAll(event);
      },
      0
    ); // add a delay to ensure to be fired after a possible click event
  },

  // a click on this input field is always introduced by an focusIn event
  // select all on click works on iOS only if the focusIn event was NOT fired before
  click(event) {
    if (this.get('isTouchDevice') === true) {
      this.selectAll(event);
    }
  },

  focusOut() {
    this.set('focus', false);
    // in most cases the input field reflects the model value, but in rare cases like after the using the backspace button
    // the value of the model is not instantly updated. So make sure that it will be updated at least on focus out.
    this.set('value', this.get('DOMinputValue'));
  },

  selectAll: function(event) {
    event.target.setSelectionRange(0, 999);
    this.set('focus', true);
  },

  handleBackspace: function(event) {
    var cursorPosition = this.get('selectionStart');
    if (this.get('allSelected') === true) {
      event.preventDefault();
      this.get('DOMinputField').val('');
    } else if (this.get('somethingSelected') === true) {
      event.preventDefault();
      this.get('DOMinputField').val(
        this.get('preSelection') + this.get('postSelection')
      );
      this.get('DOMinputField')[0].setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    } else {
      // nothing is selected
      event.preventDefault();
      var preCursorTextWithoutLastChar = this.get('preSelection').slice(
        0,
        this.get('preSelection').length - 1
      );
      this.get('DOMinputField').val(
        preCursorTextWithoutLastChar + this.get('postSelection')
      );
      this.get('DOMinputField')[0].setSelectionRange(
        cursorPosition - 1,
        cursorPosition - 1
      );
    }
  },

  // remove maxLength and minLength attribute binding that is defined in the Ember.TextField component. instead of the
  // native maxLength/minLength attibute, the input event listener will take care of maxLength/minLength interpretation
  removeLengthBindings: function() {
    this.set(
      'attributeBindings',
      A(this.get('attributeBindings'))
        .removeObject('maxLength')
        .removeObject('minLength')
    );
  },

  handleWidthClassName: observer('value', function() {
    var valueLength = this.get('value').toString().length;
    valueLength =
      valueLength < this.get('minLength') ? this.get('minLength') : valueLength;
    this.set('widthClassName', 'digits-' + valueLength);
  }),

  _addLeadingZeros: function(value) {
    var maxLength = parseInt(this.get('maxLength'));
    var missingLeadingZeros = maxLength - value.toString().length;
    if (this.addLeadingZeros === true && missingLeadingZeros > 0) {
      for (var i = 0; i < missingLeadingZeros; i++) {
        value = '0' + value;
      }
    }
    return value;
  },

  actions: {
    increaseValue(value) {
      var increaseValue = value || 1;
      var newValue = parseInt(this.get('value')) + parseInt(increaseValue);
      this.set('value', this._addLeadingZeros(newValue));
    },

    decreaseValue(value) {
      var increaseValue = value || 1;
      var newValue = parseInt(this.get('value')) - parseInt(increaseValue);
      this.set('value', this._addLeadingZeros(newValue));
    }
  }
});
