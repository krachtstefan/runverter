import OneWayTel from './../one-way-tel';
import Ember from 'ember';
export default OneWayTel.extend({
  attributeBindings: ['autocomplete'],
  autocomplete: "off",
  leadingZeros: false,

  input(event) {
    this._super(...arguments);
    var currentValue = this.readDOMAttr('value');
    var nextValue = currentValue;
    var cursorPosition = event.target.selectionStart; // cursor position starts with 1
    var maxLength = parseInt(this.get("maxlength"));

    // if the inputs new value would exceed the allowed maxlength
    if(nextValue.length > maxLength){
      var nextValueArr = nextValue.split('');
      var spaceLeft = maxLength-cursorPosition; // defines how many positions the curser has left before exceeding the max value
      var offset = spaceLeft < 0 ? spaceLeft-1 : 0; // use spaceLeft to calculate the offset for the splice function
      nextValueArr.splice(cursorPosition+offset, 1); // extract the part of the old value that, should be overwritten by the new value
      nextValueArr.splice(maxLength); // make sure not to exceed the maxlength (fe. if someone pastes multiple characters at once)
      nextValue = nextValueArr.join('');
    }

    // Prevent input value from exceeding max length if ember doesn't update the value attribute
    // Example: If the Input contains "112", the max length is 3 and the cursor is at the very end
    // if you type a "2" the new value would still be "112" and ember won't update the value attribute even if there is a binding
    // So the value would still be "112" but the DOM value would be "1122". In this case remove every character that would exceed the max length
    if(parseInt(this.get("value"))===parseInt(nextValue) && currentValue.length > maxLength){
      this.$().val(currentValue.slice(0,maxLength));
    }

    this.set("value", nextValue);
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

  // remove maxlength attribute binding that is defined in the Ember.TextField component
  // instead of the native maxlength attibute, the input event listener will take care of maxlenght interpretation
  removeMaxLengthBindings: Ember.on('init', function() {
    this.get('attributeBindings').removeObject("maxlength");
  }),

  _addLeadingZeros: function(value){
    var maxLength = parseInt(this.get("maxlength"));
    var missingLeadingZeros = maxLength - value.toString().length;
    if(this.leadingZeros === true && missingLeadingZeros > 0){
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
