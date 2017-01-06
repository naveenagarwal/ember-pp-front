import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    var newKey = "",
        key = "";
    for(key in json.data.attributes){
      newKey = key.replace("-", "_");
      json.data.attributes[newKey] = json.data.attributes[key];
      delete json.data.attributes[key];
    }

    for(key in json.data.relationships)
    return json;
  },
});
