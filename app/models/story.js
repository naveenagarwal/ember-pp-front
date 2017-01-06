import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  storyNo: DS.attr('string'),
  description: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  sprint: DS.belongsTo('sprint'),
  storyPoints: DS.hasMany('story-point')
});
