import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-estimates-for-story', 'Integration | Component | user estimates for story', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{user-estimates-for-story}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#user-estimates-for-story}}
      template block text
    {{/user-estimates-for-story}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
