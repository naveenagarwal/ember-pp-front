import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  story: null,
  doneLoading: false,

  init() {
    this._super(...arguments);
    // fetch all the stories for sprint
    // console.log(this.get('store').peekRecord('story', this.get("story").id));
    // this.set("story",this.get('store').peekRecord('story', this.get("story").id));
    var story = this.get('store').peekRecord('story', this.get("story").id);
    this.set("story", story);
    this.set("doneLoading", true);
    // this.get('store').findRecord('story', this.get("story").id).then((story)=> {
    //   that.set("story", story);
    //   that.set("doneLoading", true);
    // });

  }
});
