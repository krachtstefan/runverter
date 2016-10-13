import Ember from 'ember';
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  templates : Ember.computed("i18n.locale", function(){
    return [
      {
        'name' : "sub 4",
        'startM' : "9000",
        'endM' : "11000",
        'timeSec' : new BigNumber(14399)
      },
      {
        'name' : "sub 3",
        'startM' : "39000",
        'endM' : "43000",
        'timeSec' : new BigNumber(10799)
      }
    ];
  })
});
