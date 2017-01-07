import Ember from 'ember';

export default Ember.Component.extend({
  userEstmatedthisStory: false,
  store: Ember.inject.service(),
  userEstimate: null,

  init() {
    this._super(...arguments);
    // check if user already submitted the estimates on page load
    // And sets the property to estimated valu
    var that = this;
    var story = this.get('store').peekRecord('story', this.get("showStoryId"));
    story.get('storyPoints').then((storyPoints) => {
      storyPoints.map(function(storyPoint){
        storyPoint.get('user').then((user) => {
          if(user && user.get("id") === Cookies.get("userId")){
            that.set("userEstmatedthisStory", true);
            that.set("userEstimate", storyPoint.get("estimatedPoints"));
            return false;
          }else {
            console.log(storyPoint);
          }
        });
      });
    });

  }
});
