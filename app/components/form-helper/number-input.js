import Ember from 'ember';
export default Ember.TextField.extend({
  attributeBindings: ['value:value'], // behaves different than the default "value"
  type: "tel", // inputs with the type "tel" have the advantage of only allowing numeric values without showing spin buttons as the "number" input does
  autocomplete: "off",

  input(event) {
    this._super(...arguments);
    var oldValue = this.readDOMAttr('value');
    var newValue = oldValue;
    var cursorPosition = event.target.selectionStart; // cursor position starts with 1
    var maxLength = parseInt(this.get("maxlength"));

    // if the inputs new value would exceed the allowed maxlength
    if(newValue.length > maxLength){
      var newValueArr = newValue.split('');
      var spaceLeft = maxLength-cursorPosition; // defines how many positions the curser has left before exceeding the max value
      var offset = spaceLeft < 0 ? spaceLeft-1 : 0; // use spaceLeft to calculate the offset for the splice function
      newValueArr.splice(cursorPosition+offset, 1); // extract the part of the old value that, should be overwritten by the new value
      newValueArr.splice(maxLength); // make sure not to exceed the maxlength (fe. if someone pastes multiple characters at once)
      newValue = newValueArr.join('');
    }

    // Prevent input value from exceeding max length if ember doesn't update the value attribute
    // Example: If the Input contains "112", the max length is 3 and the cursor is at the very end
    // if you type a "2" the new value would still be "112" and ember won't update the value attribute even if there is a binding
    // So the value would still be "112" but the DOM value would be "1122". In this case remove every character that would exceed the max length
    if(parseInt(this.get("value"))===parseInt(newValue) && oldValue.length > maxLength){
      this.$().val(oldValue.slice(0,maxLength));
    }

    this.set("value", parseInt(newValue));
    return true;
  },

  keyDown(event) {
    var hotkeyPressed = event.ctrlKey === true || event.shiftKey === true || event.altKey === true ? true : false;
    switch(event.keyCode) {
      case 38:
        event.preventDefault();
        var steppSize = hotkeyPressed === true ? 10 : 1
        this.send('increaseValue', steppSize);
        break;
      case 40:
        event.preventDefault();
        var steppSize = hotkeyPressed === true ? 10 : 1
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

  actions: {
    increaseValue(value) {
      var value = value || 1;
      this.set("value", parseInt(this.get("value"))+parseInt(value));
    },

    decreaseValue(value) {
      var value = value || 1;
      this.set("value", parseInt(this.get("value"))-parseInt(value));
    }
  }
});
