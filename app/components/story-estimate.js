import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service("login-user"),
  store: Ember.inject.service(),
  estimateSubmitted: false,
  userEstimate : null,
  otherEstimatesAvailable: false,
  usersEstimates: [],
  // test: [1,2,3],

  init() {
    this._super(...arguments);

    // check if user already submitted the estimates on page load
    // And sets the property to estimated value

    var that = this;
    var story = this.get('store').peekRecord('story', this.get("storyId"));
    story.get('storyPoints').then((storyPoints) => {
      storyPoints.map(function(storyPoint){
        storyPoint.get('user').then((user) => {
          if(user.get("id") === Cookies.get("userId")){
            that.set("estimateSubmitted", true);
            that.set("userEstimate", storyPoint.get("estimatedPoints"));
            return false;
          }
        });
      });
    });


    if(!!Cookies.get("userEmail") && !!Cookies.get("userName") && !!Cookies.get("userId")){
      this.set("loggedIn", true);
    }
    // find others estimates
    var that = this;
    this.get('store').query('story-point', {filter: { story_id: this.get("storyId")} }).then((storyPoints) => {
      var usersEstimates = [];
      storyPoints.map(function (storyPoint) {
        usersEstimates.push({
          name: storyPoint.get("user").get("name"),
          estimatedPoints: storyPoint.get("estimatedPoints")
        });
      });
      that.set("usersEstimates", usersEstimates);
      that.set("otherEstimatesAvailable", true);
    });

  },

  actions: {
    estimate(value) {
      // var test = this.get("test");
      // test.push(value);
      // this.propertyWillChange("test");
      // this.set("test", test);
      // this.propertyDidChange("test");
      this.set("userEstimate", value);
    },

    submitEstimate() {
      if(!!!Cookies.get("userId")){
        console.log("Not Logged In, Aborting!!!");
        return false;
      }
      console.log(Cookies.get("userId"));
      var value = this.get("userEstimate");
      var storyId = this.get("storyId");
      var that = this;

      var story = this.get('store').peekRecord('story', storyId);
      // this.get('store').findRecord('user', {id: Cookies.get("userId"), "story_id": storyId}).then(function(user){
      var user = this.get('store').peekRecord('user', Cookies.get("userId"));
      var params =  {
          story: story,
          estimatedPoints: value,
          user: user
        };
      var storyPoint = that.get('store').createRecord('story-point', params);


      storyPoint.save().then(function(data){
        that.set("estimateSubmitted", true);
        story.get('storyPoints').pushObject(storyPoint);
        user.get('storyPoints').pushObject(storyPoint);

        // this updates the list of estimations from other users
        // on story page
        that.propertyWillChange("usersEstimates");
        var usersEstimates = that.get("usersEstimates");
        usersEstimates.push({
          name: user.get("name"),
          estimatedPoints: value
        });
        that.set("usersEstimates", usersEstimates);
        that.propertyDidChange("usersEstimates");

      });

      // });
    }
  }
});
