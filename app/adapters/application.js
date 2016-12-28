import DS from 'ember-data';

// export default DS.RESTAdapter.extend({
//   host: 'http://localhost:3000'
// });

import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend();

export default DS.JSONAPIAdapter.extend({
  host: 'http://10.10.0.99:3000'
});
