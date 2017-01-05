import DS from 'ember-data';

export default DS.Model.extend({
  estimatedPoints: DS.attr('number'),
  estimatedTime: DS.attr('number'),
  user: DS.belongsTo('user'),
  story: DS.belongsTo('story')
});
