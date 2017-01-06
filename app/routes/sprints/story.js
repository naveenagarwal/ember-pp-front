import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    var story = this.store.peekRecord('story', params.story_id);
    if(!!story){
      return story;
    }else {
      return this.store.findRecord('story', params.story_id);
    }
  }
});
