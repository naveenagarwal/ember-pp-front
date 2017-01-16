import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {

    addProject(){
      var org = this.get('store').peekRecord("organization", Cookies.get("orgId"));
      var name = this.get("name");

      if(!org || !name){
        console.log('project details absent');
        return false;
      }

      var params = {
        organization: org,
        name: name
      };

      console.log(params);

      var project = this.get("store").createRecord("project", params);
      console.log(project.get("name"));
      project.save().then(function(){
        org.get("projects").pushObject(project);
        this.get('router').transitionTo('projects.show', project.get("id"));
      }.bind(this));

    }
  }
});
