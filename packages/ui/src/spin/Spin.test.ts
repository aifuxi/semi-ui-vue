import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';

import Spin from './Spin.vue';

afterEach(() => {
  vi.useRealTimers();
  delete semiGlobal.config.overrideDefaultProps;
});

describe('Spin', () => {
  it('区分 spinning 缺省、显式 false 与显式 true', () => {
    for (const spinning of [undefined, true] as const) {
      const wrapper = mount(Spin, {
        props: spinning === undefined ? {} : { spinning },
      });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-spin', 'semi-spin-middle']));
      expect(wrapper.classes()).not.toContain('semi-spin-hidden');
      expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(true);
    }

    const hidden = mount(Spin, { props: { spinning: false } });
    expect(hidden.classes()).toContain('semi-spin-hidden');
    expect(hidden.find('.semi-spin-wrapper').exists()).toBe(false);
  });

  it('遵循显式 prop > 全局默认 > 固定默认的优先级', () => {
    semiGlobal.config.overrideDefaultProps = {
      Spin: { className: 'global-spin', delay: 80, size: 'large', spinning: false },
    };
    const configured = mount(Spin);
    expect(configured.classes()).toEqual(
      expect.arrayContaining(['semi-spin-large', 'semi-spin-hidden']),
    );
    expect(configured.classes()).toContain('global-spin');

    const explicit = mount(Spin, {
      props: { delay: 0, size: 'small', spinning: true },
    });
    expect(explicit.classes()).toContain('semi-spin-small');
    expect(explicit.classes()).not.toContain('semi-spin-hidden');
  });

  it('只延迟 false 到 true，并在到期后显示', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Spin, { props: { delay: 1000, spinning: true } });
    expect(wrapper.classes()).not.toContain('semi-spin-hidden');

    await wrapper.setProps({ spinning: false });
    expect(wrapper.classes()).toContain('semi-spin-hidden');
    await wrapper.setProps({ spinning: true });
    expect(wrapper.classes()).toContain('semi-spin-hidden');
    await vi.advanceTimersByTimeAsync(999);
    expect(wrapper.classes()).toContain('semi-spin-hidden');
    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    expect(wrapper.classes()).not.toContain('semi-spin-hidden');
  });

  it('卸载时清理 delay timer', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Spin, { props: { delay: 1000, spinning: false } });
    await wrapper.setProps({ spinning: true });
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('渲染固定 SVG、三种尺寸和 data attrs 边界', () => {
    for (const size of ['small', 'middle', 'large'] as const) {
      expect(mount(Spin, { props: { size } }).classes()).toContain(`semi-spin-${size}`);
    }
    const wrapper = mount(Spin, {
      attrs: { 'aria-label': '不应透传', 'data-testid': 'spin', title: '不应透传' },
      props: { className: 'compat', style: { color: 'red' } },
    });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-spin', 'compat']));
    expect(wrapper.attributes('data-testid')).toBe('spin');
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect(wrapper.attributes('title')).toBeUndefined();
    expect(wrapper.attributes('style')).toContain('color: red');
    expect(wrapper.get('svg').attributes()).toMatchObject({
      'aria-hidden': 'true',
      'data-icon': 'spin',
      height: '48',
      viewBox: '0 0 36 36',
      width: '48',
    });
  });

  it('indicator/tip slot 优先于 VNode prop并保留固定包装', () => {
    const wrapper = mount(Spin, {
      props: {
        indicator: h('span', { class: 'prop-indicator' }, 'prop indicator'),
        tip: h('span', { class: 'prop-tip' }, 'prop tip'),
      },
      slots: {
        indicator: '<strong class="slot-indicator">slot indicator</strong>',
        tip: '<em class="slot-tip">slot tip</em>',
      },
    });
    expect(wrapper.get('.semi-spin-animate').attributes('x-semi-prop')).toBe('indicator');
    expect(wrapper.get('.slot-indicator').text()).toBe('slot indicator');
    expect(wrapper.find('.prop-indicator').exists()).toBe(false);
    expect(wrapper.get('[x-semi-prop="tip"] .slot-tip').text()).toBe('slot tip');
    expect(wrapper.find('.prop-tip').exists()).toBe(false);
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('有 children 时切换 block/hidden 并应用 childStyle', async () => {
    const wrapper = mount(Spin, {
      props: { childStyle: { opacity: 0.25 } },
      slots: { default: '<article class="content">content</article>' },
    });
    expect(wrapper.classes()).toContain('semi-spin-block');
    expect(wrapper.get('.semi-spin-children').attributes('x-semi-prop')).toBe('children');
    expect(wrapper.get('.semi-spin-children').attributes('style')).toContain('opacity: 0.25');
    expect(wrapper.get('.content').text()).toBe('content');

    await wrapper.setProps({ spinning: false });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-spin-block', 'semi-spin-hidden']),
    );
    expect(wrapper.find('.content').exists()).toBe(true);
    expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
  });

  it('初始缺省后再显式传入 spinning 仍保持响应式', async () => {
    const wrapper = mount(Spin);
    expect(wrapper.classes()).not.toContain('semi-spin-hidden');
    await wrapper.setProps({ spinning: false });
    expect(wrapper.classes()).toContain('semi-spin-hidden');
    await wrapper.setProps({ spinning: true });
    expect(wrapper.classes()).not.toContain('semi-spin-hidden');
  });
});
