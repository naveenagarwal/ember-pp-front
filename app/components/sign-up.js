import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  user: {},

  actions: {
    signUp() {
      var params = this.get("user");

      if(!params || !params.email || !params.name || !!Cookies.get("userId") ){
        console.log("Insufficent details");
        return false;
      }

      if(!!Cookies.get("userId") ){
        console.log("Already signed in.");
        return false;
      }

      var user = this.get("store").createRecord("user", params)

      user.save().then((user) => {
        console.log(user);
        Cookies.set("userEmail", user.get("email"));
        Cookies.set("userName", user.get("name"));
        Cookies.set("userId", user.get("id"));
        Cookies.set("orgId", user.get("organization").get("id"));
        window.location = "/";
      }.bind(this));

    }
  }
});
