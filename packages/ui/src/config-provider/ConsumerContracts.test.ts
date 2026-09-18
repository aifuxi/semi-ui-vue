import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { DatePicker } from '../date-picker';
import { TimePicker } from '../time-picker';
import { TextArea } from '../input';
import { Checkbox } from '../checkbox';
import { Switch } from '../switch';
import { Steps, Step } from '../steps';
import { Nav } from '../navigation';
import { Dropdown } from '../dropdown';

const wrappers: VueWrapper[] = [];
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});
it.each(['date', 'dateTime', 'dateRange', 'dateTimeRange'] as const)(
  'DatePicker marks its %s icon as decorative',
  (type) => {
    const wrapper = mount(DatePicker, { props: { type } });
    wrappers.push(wrapper);
    expect(
      wrapper
        .get(type.includes('Time') ? '.semi-icon-calendar_clock' : '.semi-icon-calendar')
        .attributes('aria-hidden'),
    ).toBe('true');
  },
);
it('TimePicker puts expanded state on the actual header trigger', () => {
  const wrapper = mount(TimePicker);
  wrappers.push(wrapper);
  expect(wrapper.get('.semi-timepicker').attributes('aria-expanded')).toBeUndefined();
  expect(wrapper.get('.semi-timepicker-header').attributes('aria-expanded')).toBe('false');
});
it('TextArea leaves validation unset by default and preserves explicit status', async () => {
  const wrapper = mount(TextArea);
  wrappers.push(wrapper);
  expect(wrapper.classes()).not.toContain('semi-input-textarea-wrapper-default');
  await wrapper.setProps({ validateStatus: 'error' });
  expect(wrapper.classes()).toContain('semi-input-textarea-wrapper-error');
});
it('Checkbox preserves the pinned enable class for normal and disabled normal inputs', async () => {
  const wrapper = mount(Checkbox);
  wrappers.push(wrapper);
  expect(wrapper.classes()).toContain('semi-checkbox-cardType_enable');
  await wrapper.setProps({ disabled: true });
  expect(wrapper.classes()).toContain('semi-checkbox-cardType_enable');
  await wrapper.setProps({ type: 'card' });
  expect(wrapper.classes()).not.toContain('semi-checkbox-cardType_enable');
});
it('Switch preserves omitted versus explicitly false checked ARIA', async () => {
  const wrapper = mount(Switch);
  wrappers.push(wrapper);
  expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBeUndefined();
  await wrapper.setProps({ checked: false });
  expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false');
});
it('Steps is only clickable when a change listener is provided', async () => {
  const children = () => [h(Step, { title: 'First' }), h(Step, { title: 'Next' })];
  const passive = mount(Steps, { slots: { default: children } });
  wrappers.push(passive);
  expect(passive.findAll('.semi-steps-item-clickable')).toHaveLength(0);
  const onChange = vi.fn();
  const active = mount(Steps, { props: { onChange }, slots: { default: children } });
  wrappers.push(active);
  expect(active.findAll('.semi-steps-item-clickable')).toHaveLength(2);
  await active.findAll('.semi-steps-item-clickable')[0]!.trigger('click');
  expect(onChange).not.toHaveBeenCalled();
  await active.findAll('.semi-steps-item-clickable')[1]!.trigger('click');
  expect(onChange).toHaveBeenCalledWith(1);
  const enabled = shallowRef(false);
  const dynamic = mount(
    defineComponent({
      setup: () => () => h(Steps, { onChange: enabled.value ? onChange : undefined }, children),
    }),
  );
  wrappers.push(dynamic);
  expect(dynamic.findAll('.semi-steps-item-clickable')).toHaveLength(0);
  enabled.value = true;
  await nextTick();
  expect(dynamic.findAll('.semi-steps-item-clickable')).toHaveLength(2);
  enabled.value = false;
  await nextTick();
  expect(dynamic.findAll('.semi-steps-item-clickable')).toHaveLength(0);
});
it('horizontal Navigation keeps its default chevron decorative and without rotation', () => {
  const wrapper = mount(Nav, {
    props: {
      mode: 'horizontal',
      items: [{ itemKey: 'group', text: 'Group', items: ['One', 'Two'] }],
    },
  });
  wrappers.push(wrapper);
  const icon = wrapper.get('.semi-icon-chevron_down');
  expect(icon.classes()).not.toContain('semi-navigation-icon-rotate-0');
  expect(icon.attributes('aria-hidden')).toBe('true');
  expect(wrapper.get('.semi-navigation-sub-title').attributes('aria-expanded')).toBeUndefined();
});

it('Dropdown preserves omitted and explicitly controlled expanded state', async () => {
  const wrapper = mount(Dropdown, { slots: { default: () => h('button', 'Menu') } });
  wrappers.push(wrapper);
  expect(wrapper.get('button').attributes('aria-expanded')).toBeUndefined();
  await wrapper.setProps({ visible: false });
  expect(wrapper.get('button').attributes('aria-expanded')).toBe('false');
  await wrapper.setProps({ visible: true });
  expect(wrapper.get('button').attributes('aria-expanded')).toBe('true');
});
