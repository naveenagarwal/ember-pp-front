import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'pp-front/config/environment';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  userName: null,
  userEmail: null,
  userId: null,
  loggedIn: false,
  loginFailed: null,
  LoggedinUser: null,
  orgId: null,

  login(params, that) {
    if(!!Cookies.get("userEmail") && !!Cookies.get("userName") && !!Cookies.get("userId") && !!Cookies.get("orgId")){
      return true
    }

    var url = ENV.apiURL + "/login";
    var that = this;

    return Ember.$.post(url, params).then(function(data) {
      console.log(data);
      if(data.success === false){
        that.set("loginFailed", true);
        that.set("loggedIn", false);
        Cookies.remove("userEmail");
        Cookies.remove("userName");
        Cookies.remove("userId");
        Cookies.remove("orgId")
        return false;
      }else{
        that.set("userEmail", data.email);
        that.set("userName", data.name);
        that.set("userId", data.name);
        that.set("loggedIn", true);
        that.set("loginFailed", false);
        that.set("orgId", data.org_id);
        Cookies.set("userEmail", data.email);
        Cookies.set("userName", data.name);
        Cookies.set("userId", data.id);
        Cookies.set("orgId", data.org_id);
        // that.get("router").transitionTo("projects");
        window.location = "/";
        return true;
      }
    }, function() {
      that.set("loginFailed", true);
      that.set("loggedIn", false);
      Cookies.remove("userEmail");
      Cookies.remove("userName");
      Cookies.remove("userId");
      Cookies.remove("orgId");
      return false;
    });
  },

  currentUser() {
    if(!Cookies.get("userId")){
      return null
    }

    var user = this.get("LoggedinUser");

    if(!!user){
      return user;
    }else{
      user = this.get('store').peekRecord('user', Cookies.get("userId"));
      this.set("LoggedinUser", user);
      return user;
    }
  }

});
