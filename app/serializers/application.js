import { LSSerializer } from 'ember-localstorage-adapter';
export default LSSerializer.extend({

  serialize(snapshot) {
    var json = this._super(...arguments);
    json.timeSecStorage = snapshot.record.get("timeSec").toString();
    json.lengthMStorage = snapshot.record.get("lengthM").toString();
    return json;
  }
});
