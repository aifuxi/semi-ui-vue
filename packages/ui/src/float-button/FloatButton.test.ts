import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import FloatButton from './FloatButton.vue';
import FloatButtonGroup from './FloatButtonGroup.vue';

const TestIcon = {
  render: () => h('span', { class: 'test-icon' }, '+'),
};

describe('FloatButton', () => {
  it('保留默认根节点、body、尺寸、形状并透传 Vue 原生 attrs', () => {
    const wrapper = mount(FloatButton, {
      attrs: {
        'aria-label': '创建',
        class: 'consumer-float-button',
        id: 'create-button',
      },
      slots: { icon: () => h(TestIcon) },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-floatButton',
        'semi-floatButton-default',
        'semi-floatButton-round',
        'consumer-float-button',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '创建',
      id: 'create-button',
    });
    expect(wrapper.get('.semi-floatButton-body').classes()).toEqual(
      expect.arrayContaining(['semi-floatButton-default', 'semi-floatButton-round']),
    );
    expect(wrapper.get('.test-icon').text()).toBe('+');
  });

  it('映射 small/large、square、colorful、disabled class 与点击契约', async () => {
    const onClick = vi.fn();
    const wrapper = mount(FloatButton, {
      props: {
        colorful: true,
        disabled: true,
        onClick,
        shape: 'square',
        size: 'large',
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-floatButton-large', 'semi-floatButton-square']),
    );
    expect(wrapper.get('.semi-floatButton-body').classes()).toEqual(
      expect.arrayContaining([
        'semi-floatButton-colorful',
        'semi-floatButton-disabled',
        'semi-floatButton-large',
        'semi-floatButton-square',
      ]),
    );
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();

    await wrapper.setProps({ disabled: false });
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('支持 _blank href 跳转并保持先跳转后 click 的顺序', async () => {
    const calls: string[] = [];
    const open = vi.spyOn(window, 'open').mockImplementation(() => {
      calls.push('open');
      return null;
    });
    const wrapper = mount(FloatButton, {
      props: {
        href: 'https://semi.design/',
        target: '_blank',
        onClick: () => calls.push('click'),
      },
    });

    await wrapper.trigger('click');

    expect(open).toHaveBeenCalledWith('https://semi.design/', '_blank');
    expect(calls).toEqual(['open', 'click']);
    open.mockRestore();
  });

  it('复现 Badge 的计数、溢出、点状、位置和主题 DOM 契约', () => {
    const count = mount(FloatButton, {
      props: {
        badge: {
          count: 120,
          overflowCount: 99,
          position: 'leftBottom',
          theme: 'light',
          type: 'danger',
        },
      },
    });
    const badgeCount = count.get('.semi-badge-count');
    expect(badgeCount.text()).toBe('99+');
    expect(badgeCount.classes()).toEqual(
      expect.arrayContaining(['semi-badge-danger', 'semi-badge-light', 'semi-badge-leftBottom']),
    );

    const dot = mount(FloatButton, { props: { badge: { count: 1, dot: true } } });
    expect(dot.get('.semi-badge-dot').text()).toBe('');
  });

  it('可用服务端 HTML 无警告 hydration', async () => {
    const renderButton = () =>
      h(
        FloatButton,
        { badge: { count: 8 }, shape: 'square', size: 'small' },
        { icon: () => h(TestIcon) },
      );
    const serverApp = createSSRApp({ render: renderButton });
    const host = document.createElement('div');
    host.innerHTML = await renderToString(serverApp);

    const warnings: string[] = [];
    const clientApp = createSSRApp({ render: renderButton });
    clientApp.config.warnHandler = (message) => warnings.push(message);
    clientApp.mount(host);

    expect(warnings).toEqual([]);
    expect(host.querySelector('.semi-floatButton-small .semi-badge-count')?.textContent).toBe('8');
    clientApp.unmount();
  });
});

describe('FloatButtonGroup', () => {
  it('渲染 item、badge、icon/content 并从直接点击目标上读取 value', async () => {
    const onClick = vi.fn();
    const wrapper = mount(FloatButtonGroup, {
      props: {
        items: [
          { content: '新建', icon: h(TestIcon), value: 'create' },
          { badge: { count: 2 }, content: '消息', value: 'message' },
        ],
        onClick,
      },
    });

    expect(wrapper.findAll('.semi-floatButtonGroup-item')).toHaveLength(2);
    expect(wrapper.get('.test-icon').text()).toBe('+');
    expect(wrapper.get('.semi-badge-count').text()).toBe('2');
    await wrapper.findAll('.semi-floatButtonGroup-item')[0]?.trigger('click');
    expect(onClick).toHaveBeenCalledWith('create', expect.any(MouseEvent));
  });

  it('与固定 Adapter 一致：disabled 只添加 group class，仍保留委托点击', async () => {
    const onClick = vi.fn();
    const wrapper = mount(FloatButtonGroup, {
      props: {
        disabled: true,
        items: [{ content: '操作', value: 'action' }],
        onClick,
      },
    });

    expect(wrapper.classes()).toContain('semi-floatButtonGroup-disabled');
    await wrapper.get('.semi-floatButtonGroup-item').trigger('click');
    expect(onClick).toHaveBeenCalledWith('action', expect.any(MouseEvent));
  });
});
