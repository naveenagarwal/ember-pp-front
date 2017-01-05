import Ember from 'ember';

export default Ember.Service.extend({
  userName: null,
  userEmail: null,
  loggedIn: false,
  loginFailed: null,

  login(params, that) {
    if(!!Cookies.get("userEmail") && !!Cookies.get("userName")){
      return true
    }

    Ember.$.post("http://localhost:4000/login", params).then(function(data) {
      if(data.success === false){
        that.set("loginFailed", true);
        that.set("loggedIn", false);
        Cookies.remove("userEmail");
        Cookies.remove("userName");
        return false;
      }else{
        that.set("userEmail", data.email);
        that.set("userName", data.name);
        that.set("loggedIn", true);
        that.set("loginFailed", false);
        Cookies.set("userEmail", data.email);
        Cookies.set("userName", data.name);
        return true; //{emial: data.email, name: data.name};
      }
    }, function() {
      that.set("loginFailed", true);
      that.set("loggedIn", false);
      Cookies.remove("userEmail");
      Cookies.remove("userName");
      return false;
    });
  }

});
