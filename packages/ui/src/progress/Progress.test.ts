import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Progress from './Progress.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('Progress', () => {
  it('渲染默认 line DOM、钳制百分比并只透传 data/ARIA attrs', async () => {
    const wrapper = mount(Progress, {
      attrs: {
        'data-testid': 'progress',
        title: '不应透传',
      },
      props: {
        ariaLabel: '下载进度',
        ariaValuetext: '正在下载',
        className: 'custom-progress',
        motion: false,
        percent: 125,
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-progress', 'semi-progress-horizontal', 'custom-progress']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '下载进度',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
      'aria-valuenow': '100',
      'aria-valuetext': '正在下载',
      'data-testid': 'progress',
      role: 'progressbar',
    });
    expect(wrapper.attributes('title')).toBeUndefined();
    expect(wrapper.get('.semi-progress-track-inner').attributes('style')).toContain('width: 100%');
    expect(wrapper.find('.semi-progress-line-text').exists()).toBe(false);

    await wrapper.setProps({ percent: -5, showInfo: true });
    expect(wrapper.attributes('aria-valuenow')).toBe('0');
    expect(wrapper.get('.semi-progress-track-inner').attributes('style')).toContain('width: 0%');
    expect(wrapper.get('.semi-progress-line-text').text()).toBe('0%');
  });

  it('覆盖 vertical/large、轨道和进度颜色以及原生 class/style', () => {
    const wrapper = mount(Progress, {
      attrs: { class: 'native-class', style: 'opacity: 0.8' },
      props: {
        direction: 'vertical',
        motion: false,
        orbitStroke: 'rgb(1, 2, 3)',
        percent: 45,
        size: 'large',
        stroke: '#f93920',
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-progress',
        'semi-progress-vertical',
        'semi-progress-large',
        'native-class',
      ]),
    );
    expect(wrapper.attributes('style')).toContain('opacity: 0.8');
    expect(wrapper.get('.semi-progress-track').attributes('style')).toContain(
      'background-color: rgb(1, 2, 3)',
    );
    const innerStyle = wrapper.get('.semi-progress-track-inner').attributes('style');
    expect(innerStyle).toContain('height: 45%');
    expect(innerStyle).toContain('background: rgb(249, 57, 32)');
  });

  it('渲染 circle 几何、small 文案规则、strokeLinecap 与 width', async () => {
    const wrapper = mount(Progress, {
      props: {
        motion: false,
        percent: 50,
        showInfo: true,
        size: 'small',
        strokeLinecap: 'square',
        strokeWidth: 10,
        type: 'circle',
        width: 120,
      },
    });
    expect(wrapper.classes()).toContain('semi-progress-circle');
    expect(wrapper.get('svg').attributes()).toMatchObject({ height: '120', width: '120' });
    expect(wrapper.find('.semi-progress-circle-text').exists()).toBe(false);
    const circles = wrapper.findAll('circle');
    expect(circles).toHaveLength(2);
    expect(circles[0]?.attributes()).toMatchObject({
      'aria-hidden': 'true',
      cx: '60',
      cy: '60',
      r: '55',
      'stroke-linecap': 'square',
      'stroke-width': '10',
    });
    const circumference = 55 * 2 * Math.PI;
    expect(Number(circles[1]?.attributes('stroke-dashoffset'))).toBeCloseTo(circumference / 2);

    await wrapper.setProps({ size: 'default' });
    expect(wrapper.get('.semi-progress-circle-text').text()).toBe('50%');
  });

  it('支持 format prop 和 Vue format slot，slot 优先', () => {
    const byProp = mount(Progress, {
      props: {
        format: (percent) => h('strong', `${percent} days`),
        motion: false,
        percent: 75,
        showInfo: true,
      },
    });
    expect(byProp.get('.semi-progress-line-text strong').text()).toBe('75 days');

    const bySlot = mount(Progress, {
      props: { format: () => 'prop', motion: false, percent: 20, showInfo: true },
      slots: { format: ({ percent }: { percent: number }) => h('em', `${percent} slot`) },
    });
    expect(bySlot.get('.semi-progress-line-text em').text()).toBe('20 slot');
  });

  it('复用固定颜色算法覆盖离散色和渐变色', () => {
    const discrete = mount(Progress, {
      props: {
        motion: false,
        percent: 90,
        stroke: [{ percent: 3, color: '#fff' }],
        type: 'circle',
      },
    });
    expect(discrete.get('.semi-progress-circle-ring-inner').attributes('style')).toContain(
      'stroke: #ffffffff',
    );

    const gradient = mount(Progress, {
      props: {
        motion: false,
        percent: 51,
        stroke: [
          { percent: 50, color: '#fff' },
          { percent: 52, color: 'rgba(0, 0, 0, 0)' },
        ],
        strokeGradient: true,
        type: 'circle',
      },
    });
    expect(gradient.get('.semi-progress-circle-ring-inner').attributes('style')).toContain(
      'stroke: #8080807f',
    );
  });

  it('区分 motion 缺省、显式 false 与显式 true', async () => {
    vi.useFakeTimers();
    const immediate = mount(Progress, {
      props: { motion: false, percent: 20, showInfo: true },
    });
    await immediate.setProps({ percent: 80 });
    expect(immediate.get('.semi-progress-line-text').text()).toBe('80%');

    const animatedPropSets: Array<{
      motion?: boolean;
      percent: number;
      showInfo: boolean;
    }> = [
      { percent: 20, showInfo: true },
      { motion: true, percent: 20, showInfo: true },
    ];
    for (const props of animatedPropSets) {
      const animated = mount(Progress, { props });
      await animated.setProps({ percent: 80 });
      expect(animated.get('.semi-progress-line-text').text()).toBe('20%');
      await vi.advanceTimersByTimeAsync(350);
      await nextTick();
      expect(animated.get('.semi-progress-line-text').text()).toBe('80%');
      animated.unmount();
    }
  });

  it('percent 更新为 NaN 时抛出固定错误', async () => {
    const wrapper = mount(Progress, { props: { motion: false, percent: 30 } });
    await expect(wrapper.setProps({ percent: Number.NaN })).rejects.toThrow(
      '[Semi Progress]:percent can not be NaN',
    );
  });
});
