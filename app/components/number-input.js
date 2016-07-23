import Ember from 'ember';
export default Ember.Component.extend({
  tagName: "input",
  classNameBindings: ["class"],
  attributeBindings: ['value', 'maxlength', 'type'],
  type: "tel" // inputs with the type "tel" have the advantage of only allowing numeric values without showing spin buttons as the "number" input does
});
