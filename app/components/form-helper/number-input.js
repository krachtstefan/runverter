import OneWayTel from './../one-way-tel';
import Ember from 'ember';
export default OneWayTel.extend({
  attributeBindings: ['autocomplete'],
  classNameBindings: ['widthClassName'],
  autocomplete: "off",
  addLeadingZeros: false,
  minLength: 2, // used for input width
  maxLength: 2, // used for input width and value handling
  lastCursorPosition: null,
  widthClassName: null, // class name that handles the with via css

  input(event) {
    this._super(...arguments);
    var lastValue = this.get("value"); // current value in model
    var currentValue = this.readDOMAttr('value'); // current value in DOM
    var nextValue = currentValue; // future value in DOM
    var cursorPosition = event.target.selectionStart; // cursor position starts with 1
    var maxLength = parseInt(this.get("maxLength"));

    // if the inputs new value would exceed the allowed maxLength
    if(nextValue.length > maxLength){
      var nextValueArr = nextValue.split('');
      var spaceLeft = maxLength-cursorPosition; // defines how many positions the curser has left before exceeding the max value
      var offset = spaceLeft < 0 ? spaceLeft-1 : 0; // use spaceLeft to calculate the offset for the splice function
      nextValueArr.splice(cursorPosition+offset, 1); // extract the part of the old value that, should be overwritten by the new value
      nextValueArr.splice(maxLength); // make sure not to exceed the maxLength (fe. if someone pastes multiple characters at once)
      nextValue = nextValueArr.join('');
    }

    // Prevent input value from exceeding max length if ember doesn't update the value attribute
    // Example: If the Input contains "112", the max length is 3 and the cursor is at the very end
    // if you type a "2" the new value would still be "112" and ember won't update the value attribute even if there is a binding
    // So the value would still be "112" but the DOM value would be "1122". In this case remove every character that would exceed the max length
    if(parseInt(this.get("value"))===parseInt(nextValue) && currentValue.length > maxLength){
      this.$().val(currentValue.slice(0,maxLength));
    }

    // Prevent an issue for values that autmatically get a leading zero
    // Example: after selecting the whole input value and typing a number like 12, the value would become 02 instead of 12 (first 01 and then 02)
    if(
      this.lastCursorPosition && // if the cursor changed
      cursorPosition === parseInt(this.get("maxLength"))+1 && // and is placed at the last position
      cursorPosition !== this.lastCursorPosition && // for the first time
      lastValue[0] === "0" // and the previous value started with a zero
    ){
      nextValue = parseInt(lastValue)+""+parseInt(nextValue);
    }

    this.set("value", nextValue);
    this.lastCursorPosition = cursorPosition;
    return true;
  },

  keyDown(event) {
    var hotkeyPressed = event.ctrlKey === true || event.shiftKey === true || event.altKey === true ? true : false;
    var steppSize = hotkeyPressed === true ? 10 : 1;
    switch(event.keyCode) {
      case 38:
        event.preventDefault();
        this.send('increaseValue', steppSize);
        break;
      case 40:
        event.preventDefault();
        this.send('decreaseValue', steppSize);
        break;
    }
    return true;
  },

  // remove maxLength and minLength attribute binding that is defined in the Ember.TextField component. instead of the
  // native maxLength/minLength attibute, the input event listener will take care of maxLength/minLength interpretation
  removeLengthBindings: Ember.on('init', function() {
    this.get('attributeBindings').removeObject("maxLength").removeObject("minLength");
  }),

  handleWidthClassName: Ember.on('init', Ember.observer('value', function() {
    var valueLength = this.get("value").toString().length;
    valueLength = valueLength > this.get("maxLength") ? this.get("maxLength") : valueLength;
    valueLength = valueLength < this.get("minLength") ? this.get("minLength") : valueLength;
    this.set("widthClassName", "digits-"+valueLength);
  })),

  _addLeadingZeros: function(value){
    var maxLength = parseInt(this.get("maxLength"));
    var missingLeadingZeros = maxLength - value.toString().length;
    if(this.addLeadingZeros === true && missingLeadingZeros > 0){
      for (var i = 0; i < missingLeadingZeros; i++) {
        value = "0"+value;
      }
    }
    return value;
  },

  actions: {
    increaseValue(value) {
      var increaseValue = value || 1;
      var newValue = parseInt(this.get("value"))+parseInt(increaseValue);
      this.set("value", this._addLeadingZeros(newValue));
    },

    decreaseValue(value) {
      var increaseValue = value || 1;
      var newValue = parseInt(this.get("value"))-parseInt(increaseValue);
      this.set("value", this._addLeadingZeros(newValue));
    }
  }
});
