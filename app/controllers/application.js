import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login: function() {
        this.set("userName", null);
        this.set("userEmail", null);
        this.set("loggedIn", false);
        this.set("loginFailed", false);

        var that= this;

        $.post("http://localhost:4000/login",{
          email: this.get("email")
        }).then(function(data) {
          if(data.success == false){
            that.set("loginFailed", true);
            that.set("loggedIn", false);
          }else{
            that.set("userEmail", data.email);
            that.set("userName", data.name);
            that.set("loggedIn", true);
            that.set("loginFailed", false);
          }
        }, function() {
          that.set("loginFailed", true);
          that.set("loggedIn", false);
        }.bind(this));
      }

  }

});
