import Ember from 'ember';

export default Ember.Route.extend({
  checkLogin(transition) {
    var target = transition.targetName;

    if((target === "home" || target === "login" || target === "sign-up") && !Cookies.get("userId") ){
      return true;
    }else if(!!Cookies.get("userId")){
      return true;
    }else{
      this.get("router").set("currentPath", "home");
      this.get("router").transitionTo("home");
    }


  },

  beforeModel(transition){
    this.checkLogin(transition);
  },

  actions: {

    willTransition(transition) {
      var target = transition.targetName;

      if((target === "home" || target === "login" || target === "sign-up") && !Cookies.get("userId") ){
        return true;
      }else if(!!Cookies.get("userId")){
        return true;
      }else{
        this.get("router").transitionTo("home");
      }
    }

  }

});
