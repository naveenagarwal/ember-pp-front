import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  role: DS.attr('string'),
  storyPoints: DS.hasMany('story-points'),
  organization: DS.belongsTo('organization')
});
