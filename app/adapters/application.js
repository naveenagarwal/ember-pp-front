import DS from 'ember-data';
import ENV from 'pp-front/config/environment';

// export default DS.RESTAdapter.extend({
//   host: 'http://localhost:3000'
// });

import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend();

export default DS.JSONAPIAdapter.extend({
  // host: 'http://10.10.0.99:3000'
  // host: 'http://localhost:4000'
  // host: 'https://pure-brook-26366.herokuapp.com/'
  host: ENV.apiURL
});
