// ensures value[int] to have at least digits[int]
// use it to convert 1 to "01"
Ember.Handlebars.helper('ensure-digits', function(value, digits) {
  digits = typeof digits == 'number' ? digits : 2;
  value = value.toString();
  zeroCount = digits-value.length;
  for(var i = 0; i < zeroCount;  i++) {
  	value = "0"+value;
	}
  return value;
});
