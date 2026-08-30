import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { semiGlobal } from '../config-provider';
import { DatePicker } from './index';

afterEach(() => {
  document.body.innerHTML = '';
  delete semiGlobal.config.overrideDefaultProps;
  vi.restoreAllMocks();
});

async function settle(): Promise<void> {
  for (let index = 0; index < 4; index += 1) {
    await nextTick();
    await flushPromises();
  }
}

describe('DatePicker', () => {
  it('resolves omitted, explicit false and bare true default-true props', async () => {
    semiGlobal.config.overrideDefaultProps = { DatePicker: { showClear: false, motion: false } };
    const Host = defineComponent({
      components: { DatePicker },
      data: () => ({ date: new Date(2024, 4, 10) }),
      template: `
        <div>
          <DatePicker data-kind="omitted" :default-value="date" />
          <DatePicker data-kind="false" :default-value="date" :show-clear="false" :motion="false" />
          <DatePicker data-kind="true" :default-value="date" show-clear motion />
        </div>
      `,
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await settle();
    const pickers = wrapper.findAllComponents(DatePicker);
    for (const picker of pickers) await picker.get('.semi-input-wrapper').trigger('mouseenter');
    expect(pickers[0]?.find('.semi-input-clearbtn').exists()).toBe(false);
    expect(pickers[1]?.find('.semi-input-clearbtn').exists()).toBe(false);
    expect(pickers[2]?.find('.semi-input-clearbtn').exists()).toBe(true);
  });

  it('renders fixed trigger classes, ARIA and a formatted default value', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        defaultValue: new Date(2024, 4, 10),
        id: 'booking-date',
        ariaDescribedby: 'booking-help',
      },
    });
    await settle();
    expect(wrapper.classes()).toContain('semi-datepicker');
    expect(wrapper.get('[role="combobox"]').attributes('aria-label')).toBe('Change date');
    const input = wrapper.get('input');
    expect(input.element).toHaveProperty('value', '2024-05-10');
    expect(input.attributes('aria-describedby')).toBe('booking-help');
    expect(wrapper.find('.semi-icon-calendar').exists()).toBe(true);
  });

  it('opens, selects a date and emits change then both Vue update events', async () => {
    const order: string[] = [];
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        defaultPickerValue: new Date(2024, 4, 1),
        motion: false,
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('model'),
        'onUpdate:value': () => order.push('value'),
      },
    });
    await wrapper.get('[role="combobox"]').trigger('click');
    await settle();
    const day = document.body.querySelector<HTMLElement>(
      '[role="gridcell"][aria-label="2024-05-12"]',
    );
    expect(day).not.toBeNull();
    day?.click();
    await settle();
    expect(order).toEqual(['change', 'model', 'value']);
    expect(wrapper.emitted('change')?.[0]?.[0]).toBeInstanceOf(Date);
    expect(wrapper.emitted('change')?.[0]?.[1]).toBe('2024-05-12');
    expect(wrapper.get('input').element).toHaveProperty('value', '2024-05-12');
    expect(document.body.querySelector('.semi-datepicker-month-grid')).toBeNull();
  });

  it('keeps a controlled value authoritative while notifying selection', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        modelValue: new Date(2024, 4, 10),
        defaultPickerValue: new Date(2024, 4, 1),
        defaultOpen: true,
        motion: false,
      },
    });
    await settle();
    document.body.querySelector<HTMLElement>('[role="gridcell"][aria-label="2024-05-12"]')?.click();
    await settle();
    expect(wrapper.emitted('change')?.[0]?.[1]).toBe('2024-05-12');
    expect(wrapper.get('input').element).toHaveProperty('value', '2024-05-10');
  });

  it('waits for both range endpoints and formats range values', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        type: 'dateRange',
        defaultPickerValue: new Date(2024, 4, 1),
        defaultOpen: true,
        motion: false,
      },
    });
    await settle();
    document.body.querySelector<HTMLElement>('[role="gridcell"][aria-label="2024-05-12"]')?.click();
    await settle();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual([
      '2024-05-12',
      '',
    ]);
    document.body.querySelector<HTMLElement>('[role="gridcell"][aria-label="2024-05-15"]')?.click();
    await settle();
    const change = wrapper.emitted('change')?.[0];
    expect(change?.[0]).toEqual([expect.any(Date), expect.any(Date)]);
    expect(change?.[1]).toEqual(['2024-05-12', '2024-05-15']);
  });

  it('swaps change arguments only when onChangeWithDateFirst is explicitly false', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        onChangeWithDateFirst: false,
        defaultPickerValue: new Date(2024, 4, 1),
        defaultOpen: true,
        motion: false,
      },
    });
    await settle();
    document.body.querySelector<HTMLElement>('[role="gridcell"][aria-label="2024-05-20"]')?.click();
    await settle();
    const change = wrapper.emitted('change')?.[0];
    expect(change?.[0]).toBe('2024-05-20');
    expect(change?.[1]).toBeInstanceOf(Date);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBeInstanceOf(Date);
  });

  it('blocks disabled dates and reports the multiple max boundary', async () => {
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        multiple: true,
        max: 1,
        disabledDate: (date) => date?.getDate() === 8,
        defaultPickerValue: new Date(2024, 4, 1),
        defaultOpen: true,
        motion: false,
      },
    });
    await settle();
    const disabled = document.body.querySelector<HTMLElement>('[aria-label="2024-05-08"]');
    expect(disabled?.getAttribute('aria-disabled')).toBe('true');
    disabled?.click();
    await settle();
    expect(wrapper.emitted('change')).toBeUndefined();
    document.body.querySelector<HTMLElement>('[aria-label="2024-05-09"]')?.click();
    await settle();
    document.body.querySelector<HTMLElement>('[aria-label="2024-05-10"]')?.click();
    await settle();
    expect(wrapper.emitted('maxSelect')).toHaveLength(1);
  });

  it('uses a stable custom popup container and cleans it on unmount', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        defaultOpen: true,
        defaultPickerValue: new Date(2024, 4, 1),
        getPopupContainer: () => container,
        motion: false,
      },
    });
    await settle();
    expect(container.querySelector('.semi-datepicker-month-grid')).not.toBeNull();
    wrapper.unmount();
    await settle();
    expect(container.querySelector('.semi-datepicker-month-grid')).toBeNull();
  });

  it('exposes open, close, focus and blur against the real input', async () => {
    const wrapper = mount(DatePicker, { attachTo: document.body, props: { motion: false } });
    const exposed = wrapper.vm as unknown as {
      open(): void;
      close(): void;
      focus(): void;
      blur(): void;
    };
    exposed.focus();
    await nextTick();
    expect(document.activeElement).toBe(wrapper.get('input').element);
    exposed.open();
    await settle();
    expect(document.body.querySelector('.semi-datepicker-month-grid')).not.toBeNull();
    exposed.close();
    await settle();
    expect(document.body.querySelector('.semi-datepicker-month-grid')).toBeNull();
    exposed.blur();
    await nextTick();
    expect(document.activeElement).not.toBe(wrapper.get('input').element);
  });
});
