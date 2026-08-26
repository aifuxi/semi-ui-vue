import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('Vue 对照工作台', () => {
  it('可以通过 Vitest 编译并挂载 Vue SFC', () => {
    const wrapper = mount(App);

    expect(wrapper.get('h1').text()).toBe('Semi UI Vue 对照工作台');
    expect(wrapper.text()).toContain('v2.102.0');
  });
});
