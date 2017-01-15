import Ember from 'ember';
import DS from 'ember-data';

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

    Ember.$.post("http://localhost:4000/login", params).then(function(data) {
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
