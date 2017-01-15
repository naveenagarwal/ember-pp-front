import DS from 'ember-data';

// import { ActiveModelSerializer } from 'active-model-adapter';

// export default ActiveModelSerializer.extend();

export default DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),
  project: DS.belongsTo('project'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  stories: DS.hasMany('story')
});
