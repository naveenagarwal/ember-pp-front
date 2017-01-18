import Ember from 'ember';

export default Ember.Component.extend({
  loggedIn: false,
  session: Ember.inject.service("login-user"),

  /**
   * @override: ember lifecycle
   */
  init() {
    this._super(...arguments);

    var user = this.get('session').currentUser();
    if(!user){
      this.set("loggedIn", false);
    }else{
      this.set("loggedIn", true);
    }
  }

});
