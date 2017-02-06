import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;

$(document).on('ajaxSend', function(e, request, options) {
    request.setRequestHeader('user_id', Cookies.get("userId"));

    $("div.body").hide();
    if($('div.loader').length < 1){
      $("<div class='loader'></div>").appendTo('body');
    }
})

$(document).on('ajaxComplete', function(e, request, options) {
    $("div.body").show();
    if($('div.loader').length > 0){
      $("div.loader").remove();
    }
})

