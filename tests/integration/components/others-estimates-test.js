import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('others-estimates', 'Integration | Component | others estimates', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{others-estimates}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#others-estimates}}
      template block text
    {{/others-estimates}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
