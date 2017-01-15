import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {

    addSprint(){
      var project = this.get("project");
      var name = this.get("sprintName");

      if(!project || !name){
        console.log('sprint details absent');
        return false;
      }

      var params = {
        project: project,
        name: name,
        status: "created"
      };

      console.log(params);

      var sprint = this.get("store").createRecord("sprint", params);
      console.log(sprint.get("name"));
      sprint.save().then(function(){
        project.get("sprints").pushObject(sprint);
        this.get('router').transitionTo('projects.show', project.get("id"));
      }.bind(this));

    }
  }
});
