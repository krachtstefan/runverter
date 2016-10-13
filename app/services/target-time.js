import Ember from 'ember';
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  templates : Ember.computed("i18n.locale", function(){
    return [
      {
        'name' : "sub 4",
        'timeSec' : new BigNumber(14399)
      },
      {
        'name' : "sub 3",
        'timeSec' : new BigNumber(10799)
      }
    ];
  })
});
