import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home');
  this.route('sprints', { resetNamespace: true }, function() {
    this.route('show', {path: '/:sprint_id'});
    this.route('story', {path: '/:sprint_id/story/:story_id'});
    this.route('new-story', {path: '/:sprint_id/new-sprint' });
  });
  this.route('projects', { resetNamespace: true }, function() {
    this.route('show', {path: '/:project_id' });
    this.route('new-sprint', {path: '/:project_id/new-sprint' });
  });
});

export default Router;
