import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  story: { fetchFromJira: false },
  // fetchFromJira: false,
  showOtherFields: true,

  actions: {
    fetchFromJiraClick(value){
      if(value){
        this.set("showOtherFields", false);
      }else{
        this.set("showOtherFields", true);
      }
    },

    addStory() {
      var params = this.get("story");

      if(!params || !params.storyNo || (!params.fetchFromJira && (!params.storyNo || !params.title) ) ){
        console.log("Fill at least story no. and title", params);
        return false;
      }

      var sprint = this.get("sprint");
      params.sprint = sprint;

      var story = this.get("store").createRecord("story", params);

      story.save().then(function(){
        sprint.get("stories").pushObject(story);
        this.set("story", { fetchFromJira: false });
        this.get('router').transitionTo('sprints.show', sprint.get("id"));
      }.bind(this));


    }
  }
});
