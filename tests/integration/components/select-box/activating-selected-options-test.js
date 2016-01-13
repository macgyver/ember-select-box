import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('', 'select-box (activating selected options)', {
  integration: true
});


test('activating selected options', function(assert) {
  assert.expect(4);

  this.on('activated', (value, sb) => {
    assert.ok(typeof sb === 'object',
      'activating a selected option sends an sends an action with api');
  });

  this.render(hbs`
    {{#select-box as |sb|}}
      {{#sb.selected-options}}
        {{sb.selected-option
          on-activate=(action 'activated')
          click=(action sb.activateSelectedOptionAtIndex 0)}}
        {{sb.selected-option
          click=(action sb.activateSelectedOptionAtIndex 1)}}
      {{/sb.selected-options}}
    {{/select-box}}
  `);

  let $selectedOptions = this.$('.select-box-selected-options');
  let $one = this.$('.select-box-selected-option:eq(0)');
  let $two = this.$('.select-box-selected-option:eq(1)');

  assert.equal(this.$('.select-box-selected-option.is-active').length, 0,
    'precondition, there are no active selected options');

  $one.trigger('click');

  assert.ok($one.hasClass('is-active'),
    'selected option gets an active class name');

  let [id] = $selectedOptions.attr('aria-activedescendant').match(/\d+/);

  assert.ok(id,
    'active selected option id is added to the selected options container');

  $two.trigger('click');

  let [nextID] = $selectedOptions.attr('aria-activedescendant').match(/\d+/);

  assert.notEqual(id, nextID,
    'the active descendant is updated');
});