import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Radio, { RadioGroup } from './index';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Radio hydration', () => {
  it('同一表单内的未命名组在 hydration 后仍各自保留选中值', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const Host = {
      render: () =>
        h('form', [
          h(RadioGroup, { ariaLabel: '尺寸', defaultValue: '小', options: ['小', '大'] }),
          h(RadioGroup, { ariaLabel: '颜色', defaultValue: '红', options: ['红', '蓝'] }),
          h(RadioGroup, { name: 'delivery', options: ['快递'] }),
        ]),
    };
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = await renderToString(createSSRApp(Host));
    const radios = () => [...container.querySelectorAll('input')];
    const serverNames = radios().map((input) => input.name);
    const app = createSSRApp(Host);
    app.mount(container);

    try {
      expect(serverNames[0]).toBeTruthy();
      expect(serverNames[0]).toBe(serverNames[1]);
      expect(serverNames[2]).toBe(serverNames[3]);
      expect(serverNames[0]).not.toBe(serverNames[2]);
      expect(serverNames[4]).toBe('delivery');
      expect(radios().map((input) => input.name)).toEqual(serverNames);
      expect(container.querySelectorAll('[role="radiogroup"]')).toHaveLength(3);
      expect(radios().map((input) => input.checked)).toEqual([true, false, true, false, false]);
      radios()[1]!.click();
      expect(radios().map((input) => input.checked)).toEqual([false, true, true, false, false]);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      app.unmount();
    }
  });

  it('服务端与客户端使用相同的内容关联 ID', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Radio, { defaultChecked: true }, () => '选项') };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const serverId = container.querySelector('.semi-radio-addon')?.id;

    const app = createSSRApp(Host);
    app.mount(container);

    expect(serverId).toBeTruthy();
    expect(container.querySelector('input')?.getAttribute('aria-labelledby')).toBe(serverId);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });
});
