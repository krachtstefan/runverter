import Ember from 'ember';
/**
  * Helper to produce html safe inline css.
  *
  * @param {string} params the params of the helper, not needed in this one
  * @param {Object} args all arguments delivered to the helper
  * @param {string} args.property the css property that should be defined
  * @param {string} args.value the value of the css property
  * @param {string} args.pre a string that might be inserted before the value (f.e. url(")
  * @param {string} args.post a string that might be inserted after the value (f.e. % oder px)
  * @return {string} output string html safe string
  */
export function inlineCSS(params, args) {
  let pre = args.pre === undefined ? '' : args.pre;
  let post = args.post === undefined ? '' : args.post;
  let output = args.value && args.property ? args.property+':'+pre+args.value+post+';' : '';
  return Ember.String.htmlSafe(output);
}

export default Ember.Helper.helper(inlineCSS);
