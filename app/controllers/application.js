import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service("login-user"),
  init() {
    this.isLoggedIn();
  },

  isLoggedIn() {
    if(!!Cookies.get("userEmail") && !!Cookies.get("userName") && !!Cookies.get("userId")){
      this.set("userName", Cookies.get("userName"));
      this.set("userEmail", Cookies.get("userEmail"));
      this.set("userId", Cookies.get("userId"));
      this.set("loggedIn", true);
      this.set("loginFailed", false);
      // this.get('store').findRecord('user', Cookies.get("userId"));
      this.get('store').queryRecord('user', { filter: { id: Cookies.get("userId"), relationships: false, single_record: true } });
      return true;
    }else{
      this.set("userName", null);
      this.set("userEmail", null);
      this.set("userId", null);
      this.set("loggedIn", false);
      this.set("loginFailed", null);
      return false;
    }
  },

  actions: {
    login() {
      var params = {
        email: this.get("email")
      }
      this.get('session').login(params, this);
    },

    logout() {
      this.set("userName", null);
      this.set("userId", null);
      this.set("userEmail", null);
      this.set("loggedIn", false);
      this.set("loginFailed", null);
      this.set("email", null);
      Cookies.remove("userName");
      Cookies.remove("userEmail");
      Cookies.remove("userId");
    }

  }

});
