import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service("login-user"),
  store: Ember.inject.service(),
  estimateSubmitted: false,
  userEstimate : null,
  otherEstimatesAvailable: false,
  usersEstimates: [],

  websockets: Ember.inject.service(),
  socketRef: null,

  didInsertElement() {
    this._super(...arguments);

    /*
      2. The next step you need to do is to create your actual websocket. Calling socketFor
      will retrieve a cached websocket if one exists or in this case it
      will create a new one for us.
    */
    const socket = this.get('websockets').socketFor('ws://localhost:7000/');

    /*
      3. The next step is to define your event handlers. All event handlers
      are added via the `on` method and take 3 arguments: event name, callback
      function, and the context in which to invoke the callback. All 3 arguments
      are required.
    */
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  },

  willDestroyElement() {
    this._super(...arguments);

    const socket = this.get('socketRef');

    /*
      4. The final step is to remove all of the listeners you have setup.
    */
    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },

  myOpenHandler(event) {
      console.log(`On open event has been called: ${event}`);
    },

  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);
    var data = JSON.parse(event.data);
    console.log('data', data);
    if(!!data.name && data.estimatedPoints){

      this.propertyWillChange("usersEstimates");
      var usersEstimates = this.get("usersEstimates");
      usersEstimates.push({
        name: data.name,
        estimatedPoints: data.estimatedPoints
      });
      this.set("usersEstimates", usersEstimates);
      this.propertyDidChange("usersEstimates");

    }else{
      console.log(event.data);
    }

  },

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },



















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
        var socket = that.get("websockets").socketFor("ws://localhost:7000/");
        socket.send({name: user.get("name"), estimatedPoints: value}, true);

        // that.propertyWillChange("usersEstimates");
        // var usersEstimates = that.get("usersEstimates");
        // usersEstimates.push({
        //   name: user.get("name"),
        //   estimatedPoints: value
        // });
        // that.set("usersEstimates", usersEstimates);
        // that.propertyDidChange("usersEstimates");

      });

      // });
    }
  }
});
