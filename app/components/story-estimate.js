import Ember from 'ember';

export default Ember.Component.extend({
  notEstimated: true,

  actions: {
    estimate(value) {
      console.log(value);

    }
  }
});
