import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('email'),
  story_points: DS.belongsTo('story-point')
});
