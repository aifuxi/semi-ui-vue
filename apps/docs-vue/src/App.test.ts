import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('Vue 对照工作台', () => {
  it('可以通过 Vitest 编译并挂载 Vue SFC', () => {
    const wrapper = mount(App);

    expect(wrapper.get('h1').text()).toBe('Semi UI Vue 对照工作台');
    expect(wrapper.text()).toContain('v2.102.0');
  });

  it('通过公共 Button 包渲染已就绪的对照场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'button-types' } });

    expect(wrapper.attributes('data-parity-scenario')).toBe('button-types');
    expect(wrapper.attributes('data-reference-status')).toBe('ready');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.find('[data-testid="vue-scenario-pending"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="button-types-vue"]').findAll('button')).toHaveLength(5);

    await wrapper.get('[data-parity-target="button-danger"]').trigger('click');
    expect(wrapper.get('output').text()).toContain('最近操作：危险按钮');
  });

  it('通过公共 Divider 包渲染完整对照场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'divider' } });

    expect(wrapper.attributes('data-parity-scenario')).toBe('divider');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="divider-vue"]').findAll('.semi-divider')).toHaveLength(8);
    expect(wrapper.get('[data-parity-target="divider-content-left"]').text()).toBe('这是居左文字');
  });

  it('通过公开图标包渲染稳定、AI、Lab 与自定义 Icon 场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'icon' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="icon-vue"]').findAll('.semi-icon')).toHaveLength(12);
    expect(wrapper.get('[data-parity-target="icon-size-small"]').classes()).toContain(
      'semi-icon-small',
    );
    expect(wrapper.get('[data-parity-target="icon-lab"] svg').element.tagName).toBe('svg');
  });

  it('通过公共 Space 包渲染间距、换行、方向与对齐场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'space' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="space-vue"]').findAll('.semi-space')).toHaveLength(10);
    expect(wrapper.get('[data-parity-target="space-array-wrap"]').classes()).toContain(
      'semi-space-wrap',
    );
    expect(wrapper.get('[data-parity-target="space-vertical"]').classes()).toContain(
      'semi-space-vertical',
    );
  });

  it('通过公共 FloatButton 包渲染尺寸、状态、徽章与按钮组场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'float-button' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(
      wrapper.get('[data-testid="float-button-vue"]').findAll('.semi-floatButton'),
    ).toHaveLength(7);
    expect(wrapper.get('.float-button-target-colorful .semi-floatButton-body').classes()).toContain(
      'semi-floatButton-colorful',
    );
    expect(wrapper.get('.float-button-target-badge .semi-badge-count').text()).toBe('99+');
    await wrapper.get('.float-button-target-default').trigger('click');
    expect(wrapper.get('output').text()).toContain('最近操作：default');
  });

  it('通过公共 Layout 包渲染语义区块、嵌套布局与 Sider', () => {
    const wrapper = mount(App, { props: { scenarioId: 'layout' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="layout-vue"]').findAll('.semi-layout')).toHaveLength(4);
    expect(wrapper.get('[data-parity-target="layout-with-sider"]').classes()).toContain(
      'semi-layout-has-sider',
    );
    expect(wrapper.get('[data-parity-target="layout-sider"]').element.tagName).toBe('ASIDE');
    expect(wrapper.get('[data-parity-target="layout-semantic"]').element.tagName).toBe('ARTICLE');
  });
});
