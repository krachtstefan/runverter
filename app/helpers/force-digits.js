import { helper } from '@ember/component/helper';
/**
  * Force input string to have a certain length. If the required length is not fullfilled
  * this method will change the string to achieve the required lenght by pre- or appending
  * a certain filler string. This is usefull to add leading leading zeros to a numeric string
  *
  * @param  {string} params the params of the helper, not needed in this one
  * @param  {Object} args all arguments delivered to the helper
  * @param {string} args.value the value that might be filled
  * @param {string} args.mode filling mode, might be append or prepend, append by default
  * @param {string|number} args.length the minimum lenght that the output string will have, 2 by default
  * @param {string|number} args.filler the string that is used to fill, 0 by default
  * @return {string} output string
  */
export function forceDigits(params, args) {
  var output = String(args.value);
  let mode = ["append", "prepend"].indexOf(args.mode) >= 0 ? args.mode : "append";
  let length = args.length === undefined ? 2 : parseInt(args.length);
  let filler = args.filler === undefined ? "0" : args.filler;

  for (var i = output.length; i < length; i++) {
    output = mode === "append" ? output+filler : filler+output;
  }
  return output;
}

export default helper(forceDigits);
