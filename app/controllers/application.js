import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service("login-user"),
  doenLoginCheck: false,
  init() {
    this.isLoggedIn();
  },

  isLoggedIn() {
    if(!!Cookies.get("userEmail") && !!Cookies.get("userName") && !!Cookies.get("userId") && !!Cookies.get("orgId")){
      var that = this;

      this.get('store').queryRecord('user', { filter: { id: Cookies.get("userId"), single_record: true } }).then((user) => {
        that.set("userName", Cookies.get("userName"));
        that.set("userEmail", Cookies.get("userEmail"));
        that.set("userId", Cookies.get("userId"));
        that.set("orgId", Cookies.get("orgId"))
        that.set("loggedIn", true);
        that.set("loginFailed", false);
        that.set("doenLoginCheck", true);
      });

      // this.get('store').findRecord('user', Cookies.get("userId"));

      return true;
    }else{
      this.set("userName", null);
      this.set("userEmail", null);
      this.set("userId", null);
      this.set("orgId", null);
      this.set("loggedIn", false);
      this.set("loginFailed", null);
      this.set("doenLoginCheck", true);
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
      this.set("orgId", null);
      this.set("loginFailed", null);
      this.set("email", null);
      Cookies.remove("userName");
      Cookies.remove("userEmail");
      Cookies.remove("userId");
      Cookies.remove("orgId")
    }

  }

});
