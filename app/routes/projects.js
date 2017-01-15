import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    if(!!Cookies.get("orgId")){
      return this.store.query('project', { filter: { organization_id: Cookies.get("orgId")} });
    }else{
      console.log("You need to login to see projects");
    }

  }
});
