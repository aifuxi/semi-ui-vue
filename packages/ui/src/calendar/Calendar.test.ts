/* eslint-disable vue/one-component-per-file -- test hosts cover Locale, custom Portal containers, and cleanup. */
import { flushPromises, mount } from '@vue/test-utils';
import { addDays } from 'date-fns';
import { createApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider, type SemiLocale } from '../config-provider';
import Calendar, { CALENDAR_MODES, type CalendarEvent } from './index';

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
  constructor(readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }
}

const displayValue = new Date(2023, 3, 10, 8, 32, 0);

function event(key: string, date: Date, label: string, allDay = false): CalendarEvent {
  return {
    key,
    start: date,
    ...(allDay ? {} : { end: new Date(date.getTime() + 60 * 60 * 1000) }),
    allDay,
    content: h('span', { class: `event-${key}` }, label),
  };
}

describe('Calendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(displayValue);
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    TestResizeObserver.instances = [];
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('公开四种 mode 并默认渲染 week', async () => {
    expect(CALENDAR_MODES).toEqual(['day', 'week', 'month', 'range']);
    const wrapper = mount(Calendar, { props: { displayValue } });
    expect(wrapper.get('.semi-calendar-week').element.tagName).toBe('DIV');

    await wrapper.setProps({ mode: 'day' });
    expect(wrapper.get('.semi-calendar-day').element.tagName).toBe('DIV');
    await wrapper.setProps({ mode: 'month' });
    expect(wrapper.get('.semi-calendar-month').attributes('role')).toBe('grid');
    await wrapper.setProps({ mode: 'range', range: [displayValue, addDays(displayValue, 3)] });
    expect(wrapper.get('.semi-calendar-week').element.tagName).toBe('DIV');
  });

  it('区分 showCurrTime 缺省、显式 false 与显式 true', async () => {
    const defaultWrapper = mount(Calendar, { props: { displayValue, mode: 'day' } });
    await nextTick();
    expect(defaultWrapper.find('.semi-calendar-grid-curr-line').exists()).toBe(true);

    const falseWrapper = mount(Calendar, {
      props: { displayValue, mode: 'day', showCurrTime: false },
    });
    expect(falseWrapper.find('.semi-calendar-grid-curr-line').exists()).toBe(false);

    const trueWrapper = mount(Calendar, {
      props: { displayValue, mode: 'day', showCurrTime: true },
    });
    await nextTick();
    expect(trueWrapper.find('.semi-calendar-grid-curr-line').exists()).toBe(true);
  });

  it('日/周点击以半小时构造日期，月点击以日为单位', async () => {
    const wrapper = mount(Calendar, { props: { displayValue, mode: 'day' } });
    await wrapper.get('[data-time="09:30:00"]').trigger('click');
    expect(wrapper.emitted('click')?.[0]?.[1]).toEqual(new Date(2023, 3, 10, 9, 30, 0));

    await wrapper.setProps({ mode: 'month' });
    await nextTick();
    const aprilTenLabel = new Date(2023, 3, 10).toLocaleDateString();
    const aprilTen = wrapper
      .findAll('[role="gridcell"]')
      .find((cell) => cell.attributes('aria-label') === aprilTenLabel);
    expect(aprilTen).toBeDefined();
    await aprilTen!.trigger('click');
    expect((wrapper.emitted('click')?.at(-1)?.[1] as Date).getDate()).toBe(10);
  });

  it('解析日内、全天与相同时间事件并响应受控 events 更新', async () => {
    const events = [
      event('day-a', new Date(2023, 3, 10, 9), 'A'),
      event('day-b', new Date(2023, 3, 10, 9), 'B'),
      event('all', new Date(2023, 3, 10), 'All', true),
    ];
    const wrapper = mount(Calendar, {
      props: { displayValue, mode: 'day', events, height: 400, minEventHeight: 40 },
    });
    await nextTick();
    expect(wrapper.findAll('.semi-calendar-event-day')).toHaveLength(2);
    expect(wrapper.findAll('.semi-calendar-event-allday')).toHaveLength(1);
    expect(wrapper.get('.event-day-b').text()).toBe('B');

    await wrapper.setProps({ events: [event('next', new Date(2023, 3, 10, 12), 'Next')] });
    expect(wrapper.find('.event-day-a').exists()).toBe(false);
    expect(wrapper.get('.event-next').text()).toBe('Next');
  });

  it('weekStartsOn、weekend 与 scoped slots 采用 Vue 原生契约', async () => {
    const wrapper = mount(Calendar, {
      props: {
        displayValue,
        mode: 'month',
        weekStartsOn: 3,
        markWeekend: true,
        events: [event('slot', displayValue, 'fallback', true)],
      },
      slots: {
        header: () => h('strong', { class: 'custom-header' }, 'Header'),
        dateDisplay: ({ date }: { date: Date }) =>
          h('span', { class: `date-${date.getMonth()}-${date.getDate()}` }, date.getDate()),
        dateGrid: ({ date }: { date: Date }) =>
          date.getDate() === 10 ? h('i', { class: 'custom-grid' }, 'Grid') : undefined,
        event: ({ event: source }: { event: CalendarEvent }) =>
          h('b', { class: 'custom-event' }, source.key),
      },
    });
    expect(wrapper.get('.semi-calendar-month-header li').text()).toContain('周三');
    expect(wrapper.get('.custom-header').text()).toBe('Header');
    expect(wrapper.get('.date-3-10').text()).toBe('10');
    expect(wrapper.get('.custom-grid').text()).toBe('Grid');
    expect(wrapper.find('.semi-calendar-weekend').exists()).toBe(true);
    await wrapper.setProps({ mode: 'day' });
    expect(wrapper.find('.custom-event').exists()).toBe(true);
  });

  it('ConfigProvider 的 en-US Calendar Locale 可响应更新', async () => {
    const english: SemiLocale = {
      code: 'en-US',
      Calendar: {
        allDay: 'All Day',
        AM: '${time} AM',
        PM: '${time} PM',
        datestring: '',
        remaining: '${remained} more',
        close: 'Close event list',
      },
    };
    const Host = defineComponent({
      props: { locale: { type: Object, required: true } },
      setup(hostProps) {
        return () =>
          h(ConfigProvider, { locale: hostProps.locale as SemiLocale }, () =>
            h(Calendar, { displayValue, mode: 'day', showCurrTime: false }),
          );
      },
    });
    const wrapper = mount(Host, { props: { locale: english } });
    expect(wrapper.get('.semi-calendar-all-day-tag').text()).toBe('All Day');
    expect(wrapper.findAll('.semi-calendar-time-item')[13]!.text()).toBe('1 PM');

    await wrapper.setProps({
      locale: { ...english, Calendar: { ...(english.Calendar as object), allDay: 'Whole day' } },
    });
    expect(wrapper.get('.semi-calendar-all-day-tag').text()).toBe('Whole day');
  });

  it('月视图折叠卡片首次挂到稳定自定义容器，并按顺序触发 more/close', async () => {
    const popup = document.createElement('div');
    popup.id = 'calendar-popup';
    document.body.append(popup);
    const events = [
      event('one', displayValue, 'One', true),
      event('two', displayValue, 'Two', true),
    ];
    const Host = defineComponent({
      setup() {
        return () =>
          h(ConfigProvider, { getPopupContainer: () => popup }, () =>
            h(Calendar, { displayValue, events, height: 120, mode: 'month' }),
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await flushPromises();
    const more = wrapper.get('.semi-calendar-month-event-card-wrapper');
    await more.trigger('click');
    await flushPromises();
    expect(popup.querySelector('.semi-portal-inner')).not.toBeNull();
    expect(popup.textContent).toContain('One');
    expect(wrapper.findComponent(Calendar).emitted('moreClick')).toHaveLength(1);
    expect(wrapper.findComponent(Calendar).emitted('click')).toBeUndefined();

    const close = popup.querySelector<HTMLButtonElement>('.semi-calendar-month-event-card-close');
    expect(close).not.toBeNull();
    close!.click();
    await flushPromises();
    expect(wrapper.findComponent(Calendar).emitted('close')).toHaveLength(1);

    wrapper.unmount();
  });

  it('卸载时断开 Month ResizeObserver 且不保留 Portal', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({
      render: () =>
        h(Calendar, {
          displayValue,
          events: [event('one', displayValue, 'One', true)],
          height: 120,
          mode: 'month',
        }),
    });
    app.mount(host);
    await nextTick();
    const observer = TestResizeObserver.instances.at(-1)!;
    expect(observer.observe).toHaveBeenCalledTimes(1);
    app.unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.semi-portal-inner')).toBeNull();
  });
});
