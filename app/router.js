import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home');
  this.route('sprints',{ resetNamespace: true }, function() {
    this.route('show', {path: '/:sprint_id'});
    this.route('story', {path: '/:sprint_id/story/:story_id'});
  });
  this.route('loading');
});

export default Router;
