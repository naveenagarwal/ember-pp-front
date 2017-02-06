import Ember from 'ember';
import ENV from 'pp-front/config/environment';

export default Ember.Component.extend({
  jira: { jira_site: "http://srijan.atlassian.net:443/" },

  actions: {
    addCredentials() {
      var params = this.get("jira");

      if(!params || !params.jira_username || !params.jira_password || !params.jira_site || !Cookies.get("userId")){
        console.log("Invalid data!!!");
        return false;
      }

      var url =  ENV.apiURL + "/users/" + Cookies.get("userId") + "/add_credentials/"
      var that = this;
      $.ajax({
        url: url,
        method: "PATCH",
        data: {jira: params},
        dataType: "json",
        success: function(data){
          if(data.success){
            console.log("saved successfully");
            that.get('router').transitionTo('projects');
          }else{
            console.log("Error in saving data", data);
          }
        },
        error: function(){
          console.log("Error in saving data, api error");
        }
      });

    }
  }
});
