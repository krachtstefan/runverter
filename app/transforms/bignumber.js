import DS from 'ember-data';
export default DS.Transform.extend({
  serialize: function(value) {
    return value.toString();
  },
  deserialize: function(value) {
    return new BigNumber(value);
  }
});
