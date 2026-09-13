import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, shallowRef } from 'vue';

import { ConfigProvider, semiGlobal } from '../config-provider';
import TimePicker from './index';

async function flushPortal(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('TimePicker', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.useFakeTimers();
    semiGlobal.config = {};
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
    semiGlobal.config = {};
  });

  it('保留固定输入 DOM、默认格式、尺寸、校验、ARIA 与 data-*', () => {
    const wrapper = mount(TimePicker, {
      attrs: { 'data-source': 'unit' },
      props: {
        ariaLabel: '选择时间',
        defaultValue: '10:24:18',
        insetLabel: '时间',
        insetLabelId: 'time-label',
        size: 'large',
        validateStatus: 'warning',
      },
    });
    expect(wrapper.get('.semi-timepicker').classes()).toContain('semi-timepicker');
    expect(wrapper.get('input').attributes('data-source')).toBe('unit');
    expect(wrapper.get('.semi-timepicker-header').element).toBeInstanceOf(HTMLElement);
    expect(wrapper.get('.semi-timepicker-input-wrap').element).toBeInstanceOf(HTMLElement);
    expect(wrapper.get('input').element.value).toBe('10:24:18');
    expect(wrapper.get('input').attributes('aria-label')).toBe('选择时间');
    expect(wrapper.get('.semi-input-wrapper').classes()).toContain('semi-input-wrapper-large');
    expect(wrapper.get('.semi-input-wrapper').classes()).toContain(
      'semi-input-wrapper__with-suffix-icon',
    );
    expect(wrapper.get('.semi-input-wrapper').classes()).toContain('semi-input-wrapper-warning');
    expect(wrapper.get('#time-label').text()).toBe('时间');
  });

  it('输入、面板选择与清空保持 Date/string 事件和 Vue model 顺序', async () => {
    const order: string[] = [];
    const wrapper = mount(TimePicker, {
      props: {
        defaultOpen: true,
        defaultValue: '10:24:18',
        motion: false,
        scrollItemProps: { mode: 'normal' },
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('model'),
        'onUpdate:value': () => order.push('value'),
      },
      attachTo: document.body,
    });
    await flushPortal();
    await wrapper.get('input').setValue('11:20:30');
    expect(wrapper.get('input').element.value).toBe('11:20:30');
    expect(order).toEqual(['change', 'model', 'value']);
    const inputChange = wrapper.emitted('change')?.[0];
    expect(inputChange?.[0]).toBeInstanceOf(Date);
    expect(inputChange?.[1]).toBe('11:20:30');

    order.length = 0;
    const minute = document.querySelector(
      '.semi-timepicker-panel-list-minute li:not(.semi-scrolllist-item-disabled)',
    ) as HTMLElement;
    minute.click();
    await nextTick();
    expect(order).toEqual(['change', 'model', 'value']);

    order.length = 0;
    await wrapper.get('input').trigger('focus');
    await wrapper.get('.semi-input-clearbtn').trigger('mousedown');
    expect(wrapper.get('input').element.value).toBe('');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBeUndefined();
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toBe('');
  });

  it('受控 value/open 只通知并等待回写', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        motion: false,
        open: false,
        value: '10:24:18',
      },
    });
    await wrapper.get('input').trigger('focus');
    expect(wrapper.emitted('openChange')).toEqual([[true]]);
    expect(wrapper.emitted('update:open')).toEqual([[true]]);
    expect(document.querySelector('.semi-timepicker-panel')).toBeNull();
    await wrapper.get('input').setValue('11:20:30');
    expect(wrapper.get('input').element.value).toBe('11:20:30');
    const model = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date;
    expect(model.getHours()).toBe(11);
    await wrapper.setProps({ value: '12:00:00', open: true });
    await flushPortal();
    expect(wrapper.get('input').element.value).toBe('12:00:00');
    expect(document.querySelector('.semi-timepicker-panel')).not.toBeNull();
  });

  it('默认 true Boolean 区分缺省、显式 false、显式 true 与全局覆盖', () => {
    semiGlobal.config.overrideDefaultProps = { TimePicker: { showClear: false } };
    const Host = defineComponent({
      render: () =>
        h('div', [
          h(TimePicker, { defaultValue: '10:00:00', 'data-case': 'missing' }),
          h(TimePicker, { defaultValue: '10:00:00', showClear: false, 'data-case': 'false' }),
          h(TimePicker, { defaultValue: '10:00:00', showClear: true, 'data-case': 'true' }),
        ]),
    });
    const wrapper = mount(Host);
    const cases = wrapper.findAll('.semi-timepicker');
    expect(cases[0]!.find('.semi-input-wrapper-clearable').exists()).toBe(false);
    expect(cases[1]!.find('.semi-input-wrapper-clearable').exists()).toBe(false);
    expect(cases[2]!.find('.semi-input-wrapper-clearable').exists()).toBe(true);
  });

  it('range 使用左右 disabledTime、默认 header、step 与 hideDisabledOptions', async () => {
    const disabledTime = vi.fn((_value: Date[], side: 'left' | 'right') => ({
      disabledHours: () => (side === 'left' ? [1] : [2]),
    }));
    mount(TimePicker, {
      props: {
        defaultOpen: true,
        defaultValue: ['01:00:00', '02:00:00'],
        disabledTime,
        hideDisabledOptions: true,
        hourStep: 1,
        minuteStep: 15,
        motion: false,
        scrollItemProps: { mode: 'normal' },
        type: 'timeRange',
      },
      attachTo: document.body,
    });
    await flushPortal();
    expect(disabledTime).toHaveBeenCalledWith(expect.any(Array), 'left');
    expect(disabledTime).toHaveBeenCalledWith(expect.any(Array), 'right');
    const panels = document.querySelectorAll('.semi-scrolllist');
    expect(panels).toHaveLength(2);
    expect(panels[0]!.querySelector('.semi-scrolllist-header-title')?.textContent).toBe('开始时间');
    expect(panels[1]!.querySelector('.semi-scrolllist-header-title')?.textContent).toBe('结束时间');
    expect(panels[0]!.querySelectorAll('.semi-timepicker-panel-list-minute li')).toHaveLength(4);
    expect(
      [...panels[0]!.querySelectorAll('.semi-timepicker-panel-list-hour li')].some(
        (item) => item.textContent === '01',
      ),
    ).toBe(false);
    expect(
      [...panels[1]!.querySelectorAll('.semi-timepicker-panel-list-hour li')].some(
        (item) => item.textContent === '02',
      ),
    ).toBe(false);
  });

  it('单值模式不调用 disabledTime，12 小时制输出 AM/PM 与缺省格式', async () => {
    const disabledTime = vi.fn(() => ({ disabledHours: () => [10] }));
    mount(TimePicker, {
      props: {
        defaultOpen: true,
        defaultValue: '上午 10:24:18',
        disabledTime,
        motion: false,
        scrollItemProps: { mode: 'normal' },
        use12Hours: true,
      },
      attachTo: document.body,
    });
    await flushPortal();
    expect(disabledTime).not.toHaveBeenCalled();
    expect(document.querySelector('.semi-timepicker-panel-list-ampm')?.textContent).toContain(
      '上午',
    );
    expect(document.querySelectorAll('.semi-timepicker-panel-list-hour li')).toHaveLength(12);
  });

  it('wheel 模式按中心项滚动选择，并在 cycled 模式复用数据索引', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        defaultOpen: true,
        defaultValue: '10:24:18',
        motion: false,
        scrollItemProps: { cycled: true, mode: 'wheel' },
      },
      attachTo: document.body,
    });
    await flushPortal();
    const hourOuter = document.querySelector(
      '.semi-timepicker-panel-list-hour .semi-scrolllist-list-outer',
    ) as HTMLDivElement;
    expect(hourOuter.classList).not.toContain('semi-scrolllist-list-outer-nocycle');
    expect(hourOuter.querySelectorAll('li')).toHaveLength(72);
    const items = [...hourOuter.querySelectorAll<HTMLElement>('li')];
    items.forEach((item, index) => {
      vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({
        bottom: index * 36 + 36,
        height: 36,
        left: 0,
        right: 72,
        top: index * 36,
        width: 72,
        x: 0,
        y: index * 36,
        toJSON: () => ({}),
      });
    });
    vi.spyOn(hourOuter, 'getBoundingClientRect').mockReturnValue({
      bottom: 1260,
      height: 252,
      left: 0,
      right: 72,
      top: 1008,
      width: 72,
      x: 0,
      y: 1008,
      toJSON: () => ({}),
    });
    await hourOuter.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(34);
    await nextTick();
    const next = wrapper.emitted('change')?.at(-1);
    expect((next?.[0] as Date).getHours()).toBe(7);
    expect(next?.[1]).toBe('07:24:18');
  });

  it('稳定自定义容器首次打开即成为 Portal 父节点，并完成 outside/卸载清理', async () => {
    const container = document.createElement('div');
    container.id = 'time-picker-portal';
    document.body.appendChild(container);
    const wrapper = mount(TimePicker, {
      props: {
        getPopupContainer: () => container,
        motion: false,
      },
      attachTo: document.body,
    });
    await wrapper.get('input').trigger('focus');
    await flushPortal();
    expect(container.querySelector('.semi-portal .semi-timepicker-panel')).not.toBeNull();
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushPortal();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);

    wrapper.unmount();
    expect(container.querySelector('.semi-portal')).toBeNull();
  });

  it('ConfigProvider 注入 en-US、RTL、timeZone 与稳定容器', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const model = shallowRef<Date>();
    const wrapper = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        getPopupContainer: () => container,
        locale: {
          code: 'en-US',
          TimePicker: {
            ...DEFAULT_TEST_EN_LOCALE,
          },
        },
        timeZone: 'GMT+08:00',
      },
      slots: {
        default: () =>
          h(TimePicker, {
            defaultValue: 1581599305265,
            motion: false,
            'onUpdate:modelValue': (value: Date | Date[] | undefined) => {
              if (value instanceof Date) model.value = value;
            },
          }),
      },
      attachTo: document.body,
    });
    expect(wrapper.get('input').attributes('placeholder')).toBe('Select time');
    await wrapper.get('input').trigger('focus');
    await flushPortal();
    expect(container.querySelector('.semi-portal-rtl')).not.toBeNull();
    expect(container.querySelector('[x-placement="bottomRight"]')).not.toBeNull();
  });
});

const DEFAULT_TEST_EN_LOCALE = {
  AM: 'AM',
  PM: 'PM',
  begin: 'Start Time',
  end: 'End Time',
  hour: '',
  minute: '',
  placeholder: { time: 'Select time', timeRange: 'Select a time range' },
  second: '',
};
