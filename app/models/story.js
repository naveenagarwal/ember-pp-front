import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  fetchFromJira: DS.attr('boolean'),
  storyNo: DS.attr('string'),
  description: DS.attr('string'),
  revealPoints: DS.attr('boolean'),
  reset: DS.attr('boolean'),
  estimatedPoints: DS.attr('number'),
  estimatedTime: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  sprint: DS.belongsTo('sprint'),
  storyPoints: DS.hasMany('story-point')
});
