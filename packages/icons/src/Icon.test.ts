import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h, type Component } from 'vue';
import { describe, expect, it } from 'vitest';

import Icon, * as iconPackage from './index';
import { IconAIFilledLevel2, IconAIWandLevel3, IconHome, IconSpin } from './icons';

describe('Icon', () => {
  it('保留内置图标的根节点、尺寸、语义与 SVG 契约', () => {
    const wrapper = mount(IconHome, {
      props: { size: 'small' },
      attrs: { 'data-testid': 'home-icon' },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.attributes()).toMatchObject({
      role: 'img',
      'aria-label': 'home',
      'data-testid': 'home-icon',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-icon', 'semi-icon-small', 'semi-icon-home']),
    );
    expect(wrapper.get('svg').attributes()).toMatchObject({
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      focusable: 'false',
      'aria-hidden': 'true',
    });
    expect(wrapper.get('path').attributes('fill')).toBe('currentColor');
  });

  it('支持自定义 SVG、旋转、spin、前缀和原生 attrs 覆盖顺序', () => {
    const wrapper = mount(Icon, {
      props: {
        prefixCls: 'custom',
        rotate: 180,
        size: 'extra-large',
        spin: true,
        type: 'custom-shape',
      },
      attrs: {
        'aria-label': '自定义图标',
        class: 'consumer-icon',
        role: 'presentation',
        style: { color: 'rgb(255, 0, 0)', transform: 'rotate(90deg)' },
      },
      slots: { default: () => h('svg', { viewBox: '0 0 4 4' }) },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'custom-icon',
        'custom-icon-extra-large',
        'custom-icon-spinning',
        'custom-icon-custom-shape',
        'consumer-icon',
      ]),
    );
    expect(wrapper.attributes('role')).toBe('presentation');
    expect(wrapper.attributes('aria-label')).toBe('自定义图标');
    expect(wrapper.attributes('style')).toContain('transform: rotate(90deg)');
  });

  it('为双色和多色 AI 图标应用 fill，并为渐变实例生成不同 id', () => {
    const twoColor = mount(IconAIFilledLevel2, {
      props: { fill: ['#112233', '#445566'] },
    });
    expect(twoColor.findAll('path').map((path) => path.attributes('fill'))).toEqual([
      '#445566',
      '#112233',
    ]);

    const gradients = mount({
      render: () =>
        h('div', [
          h(IconAIWandLevel3, { fill: ['#111111', '#222222', '#333333', '#444444'] }),
          h(IconAIWandLevel3),
        ]),
    });
    const ids = gradients.findAll('linearGradient').map((gradient) => gradient.attributes('id'));
    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
    expect(
      gradients
        .findAll('linearGradient')
        .at(0)
        ?.findAll('stop')
        .map((stop) => stop.attributes('stop-color')),
    ).toEqual(['#444444', '#333333', '#222222', '#111111']);
  });

  it('完整导出并可服务端渲染 523 个固定稳定图标', async () => {
    const components = Object.entries(iconPackage).filter(([name]) => /^Icon[A-Z]/.test(name));
    expect(components).toHaveLength(523);
    expect(IconSpin.elementType).toBe('Icon');

    const rendered = await Promise.all(
      components.map(async ([name, component]) => ({
        name,
        html: await renderToString(h(component as Component)),
      })),
    );
    expect(rendered.every(({ html }) => html.includes('class="semi-icon'))).toBe(true);
    expect(rendered.every(({ html }) => html.includes('<svg'))).toBe(true);
  });

  it('可用服务端 HTML 无警告 hydration', async () => {
    const renderIcon = () => h(IconHome, { 'aria-label': '首页', size: 'large' });
    const serverApp = createSSRApp({ render: renderIcon });
    const host = document.createElement('div');
    host.innerHTML = await renderToString(serverApp);

    const warnings: string[] = [];
    const clientApp = createSSRApp({ render: renderIcon });
    clientApp.config.warnHandler = (message) => warnings.push(message);
    clientApp.mount(host);

    expect(warnings).toEqual([]);
    expect(host.querySelector('.semi-icon-home')).not.toBeNull();
    clientApp.unmount();
  });
});
