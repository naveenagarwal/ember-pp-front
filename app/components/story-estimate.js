import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service("login-user"),
  store: Ember.inject.service(),
  estimateSubmitted: false,
  userEstimate : null,
  otherEstimatesAvailable: false,
  usersEstimates: [],
  organizer: false,
  participant: false,
  finalEstimates: null,
  storyEstimatted: false,

  socketIOService: Ember.inject.service('socket-io'),
  socketRef: null,
  channel: null,

  didInsertElement() {
    this._super(...arguments);
    /*
      2. The next step you need to do is to create your actual socketIO.
    */
    const socket = this.get('socketIOService').socketFor('http://localhost:7000/');

    /*
    * 3. Define any event handlers
    */
    socket.on('connect', this.onConnect, this);
    /*
      4. It is also possible to set event handlers on specific events
    */
    // socket.on('myCustomNamespace', () => { socket.emit('anotherNamespace', 'some data'); });
    this.set("channel", this.get("store").peekRecord("story", this.get("storyId")).get("storyNo"));
    socket.on(this.get("channel"), this.onMessage, this );
    this.set("socketRef", socket);

  },

  onConnect() {
    console.log("conencted");
  },

  willDestroyElement() {
    this._super(...arguments);

    // const socket = this.get('socketIOService').socketFor('http://localhost:7000/');
    const socket = this.get('socketRef');
    socket.off('connect', ()=>{console.log('disconnected'); });
    socket.off('message', ()=>{console.log('disconnected'); });
    socket.off(this.get("channel"), ()=>{console.log('disconnected'); });
  },

  onMessage(data) {
    console.log('data from push server', data);
    if(!!data.name || !!data.estimatedPoints || !!data.usersEstimates){
      var usersEstimates = [];
      if(data.reload){
        usersEstimates = data.usersEstimates;
      }else{
        usersEstimates = this.get("usersEstimates");
        usersEstimates.push({
          name: data.name,
          estimatedPoints: data.estimatedPoints
        });
      }

      this.propertyWillChange("usersEstimates");
      this.set("usersEstimates", usersEstimates);
      this.propertyDidChange("usersEstimates");

      if(usersEstimates.length > 0 && this.get("otherEstimatesAvailable") === false){
        this.set("otherEstimatesAvailable", true);
      }
    }

    if(!!data.finalEstimates){
      this.propertyWillChange("model");
      this.get("model").set("estimatedPoints", data.finalEstimates);
      this.propertyDidChange("model");
      this.set("storyEstimatted", true);
    }
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
      var user = this.get('store').peekRecord("user", Cookies.get("userId"));
      this.set("organizer", user.get("role") === "organizer");
      this.set("participant", user.get("role") === "participant");
    }

    // find others estimates
    story.get('storyPoints').then((storyPoints) => {
      var usersEstimates = [];
      storyPoints.map(function (storyPoint) {

        var value;
        if(story.get("revealPoints")){
          value = storyPoint.get("estimatedPoints");
        }else{
          value = "X";
        }

        usersEstimates.push({
          name: storyPoint.get("user").get("name"),
          estimatedPoints: value
        });

      });
      that.set("usersEstimates", usersEstimates);
      if(usersEstimates.length > 0){
        that.set("otherEstimatesAvailable", true);
      }

    });

    if(!!story.get("estimatedPoints")){
      this.set("storyEstimatted", true);
    }

  },

  actions: {

    finalEstimates(value){
      var user = this.get('session').currentUser();
      if(!user){
        console.log('Not loggedin.')
        return false;
      }
      if(user.get("role") !== "organizer"){
        console.log('You are not a organizer');
        return false;
      }

      this.set("finalEstimates", value);
    },

    submitFinalEstimates(){
      var user = this.get('session').currentUser();
      if(!user){
        console.log('Not loggedin.')
        return false;
      }
      if(user.get("role") !== "organizer"){
        console.log('You are not a organizer');
        return false;
      }

      var finalEstimates = this.get("finalEstimates");
      if(!finalEstimates){
        console.log('No estimates provided');
        return false;
      }

      var story = this.get('store').peekRecord('story', this.get("storyId"));
      story.set("estimatedPoints", finalEstimates);

      var that = this;
      story.save().then((story) => {
        var socket = that.get("socketRef");
        socket.send({ channel: that.get("channel"), finalEstimates: finalEstimates });
      });

    },

    revealPoints(id){
      var that = this;
      this.get("store").findRecord('story', id).then((story) => {
        story.set("revealPoints", true);
        story.save().then((story) => {
          this.set("revealPoints", true);
          console.log("revealing points");
          story.get("storyPoints").then((storyPoints) => {
            var usersEstimates = [];
            storyPoints.map(function (storyPoint) {

              var value;
              if(story.get("revealPoints")){
                value = storyPoint.get("estimatedPoints");
              }else{
                value = "X";
              }

              usersEstimates.push({
                name: storyPoint.get("user").get("name"),
                estimatedPoints: value
              });

            });
            var socket = that.get("socketRef");
            socket.send({ channel: that.get("channel"), usersEstimates: usersEstimates, reload: true });

            that.propertyWillChange("model");
            that.get("model").set("revealPoints", true);
            that.propertyDidChange("model");
          });
        });
      });
    },

    estimate(value) {
      this.set("userEstimate", value);
    },

    submitEstimate() {
      if(!!!Cookies.get("userId")){
        console.log("Not Logged In, Aborting!!!");
        return false;
      }

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


      storyPoint.save().then(function(){
        that.set("estimateSubmitted", true);
        story.get('storyPoints').pushObject(storyPoint);
        user.get('storyPoints').pushObject(storyPoint);

        // this updates the list of estimations from other users
        // on story page
        var socket = that.get("socketRef");
        if(!story.get("revealPoints")){
          value = "X";
        }
        socket.send({channel: that.get("channel"), name: Cookies.get("userName"), estimatedPoints: value});
      });

      // });
    }
  }
});
