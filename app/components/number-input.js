import OneWayTel from './one-way-tel';
import Ember from 'ember';
export default OneWayTel.extend({
  classNameBindings: ["class"],
  attributeBindings: ['autocomplete'],
  autocomplete: "off",

  input(event) {
    var newValue = event.target.value;
    var cursorPosition = event.target.selectionStart; // cursor position starts with 1
    // if the inputs new value would exceed the allowed maxlength
    if(newValue.length > parseInt(this.get("maxlength"))){
      var newValueArr = newValue.split('');
      var spaceLeft = parseInt(this.get("maxlength"))-cursorPosition; // defines how many positions the curser has left before exceeding the max value
      var offset = spaceLeft < 0 ? spaceLeft-1 : 0; // use spaceLeft to calculate the offset for the splice function
      newValueArr.splice(cursorPosition+offset, 1); // extract the part of the old value that, should be overwritten by the new value
      newValueArr.splice(parseInt(this.get("maxlength"))); // make sure not to exceed the maxlength (fe. if someone pastes multiple characters at once)
      newValue = newValueArr.join('');
    }
    this.set("value", parseInt(newValue));
    return true;
  },

  keyDown(event) {
    switch(event.keyCode) {
      case 38:
        event.preventDefault();
        this.send('increaseValue');
        break;
      case 40:
        event.preventDefault();
        this.send('decreaseValue');
        break;
    }
    return true;
  },

  // remove maxlength attribute binding that is defined in the Ember.TextField component
  // instead of the native maxlength attibute, the input event listener will take care of maxlenght interpretation
  removeMaxLengthBindings: Ember.on('init', function() {
    this.get('attributeBindings').removeObject("maxlength");
  }),

  actions: {
    increaseValue() {
      this.set("value", parseInt(this.get("value"))+1);
    },

    decreaseValue() {
      this.set("value", parseInt(this.get("value"))-1);
    }
  }
});
