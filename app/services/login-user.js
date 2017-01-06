import Ember from 'ember';

export default Ember.Service.extend({
  userName: null,
  userEmail: null,
  userId: null,
  loggedIn: false,
  loginFailed: null,

  login(params, that) {
    if(!!Cookies.get("userEmail") && !!Cookies.get("userName") && !!Cookies.get("userId")){
      return true
    }

    Ember.$.post("http://localhost:4000/login", params).then(function(data) {
      if(data.success === false){
        that.set("loginFailed", true);
        that.set("loggedIn", false);
        Cookies.remove("userEmail");
        Cookies.remove("userName");
        Cookies.remove("userId");
        return false;
      }else{
        that.set("userEmail", data.email);
        that.set("userName", data.name);
        that.set("userId", data.name);
        that.set("loggedIn", true);
        that.set("loginFailed", false);
        Cookies.set("userEmail", data.email);
        Cookies.set("userName", data.name);
        Cookies.set("userId", data.id);
        return true;
      }
    }, function() {
      that.set("loginFailed", true);
      that.set("loggedIn", false);
      Cookies.remove("userEmail");
      Cookies.remove("userName");
      Cookies.remove("userId");
      return false;
    });
  }

});
