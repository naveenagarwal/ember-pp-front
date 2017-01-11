import Ember from 'ember';

export default Ember.Component.extend({
  userStoryPointsLoaded: false,
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);

    // find all the story points for the sprint selected
    if(!!Cookies.get("userId")){
      console.log('fetching sprint user story points');
      var that = this;
      this.get('store').queryRecord('user', { filter: { id: Cookies.get("userId"), relationships: true, single_record: true, sprint_id: this.get("sprintId") } }).then((user) => {
        that.get('store').query('story', { filter: { sprint_id: that.get("sprintId") } }).then((stories) => {
          this.set("stories", stories);
          this.set("userStoryPointsLoaded", true);
        })
      });

    }

  }


});
