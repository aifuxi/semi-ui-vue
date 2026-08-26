import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('Vue 对照工作台', () => {
  it('可以通过 Vitest 编译并挂载 Vue SFC', () => {
    const wrapper = mount(App);

    expect(wrapper.get('h1').text()).toBe('Semi UI Vue 对照工作台');
    expect(wrapper.text()).toContain('v2.102.0');
  });

  it('不会把尚未实现的 Vue 组件标记为可比较', () => {
    const wrapper = mount(App, { props: { scenarioId: 'button-types' } });

    expect(wrapper.attributes('data-parity-scenario')).toBe('button-types');
    expect(wrapper.attributes('data-reference-status')).toBe('ready');
    expect(wrapper.attributes('data-vue-status')).toBe('pending');
    expect(wrapper.get('[data-testid="vue-scenario-pending"]').text()).toContain(
      'Vue 场景尚未接入',
    );
  });
});
