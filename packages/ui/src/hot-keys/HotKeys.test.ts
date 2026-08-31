import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import HotKeysBase from './HotKeys.vue';
import { HotKeys } from './index';

function keydown(
  target: EventTarget,
  key: string,
  code: string,
  modifiers: KeyboardEventInit = {},
): { event: KeyboardEvent; dispatched: boolean } {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    code,
    key,
    ...modifiers,
  });
  return { event, dispatched: target.dispatchEvent(event) };
}

beforeEach(() => {
  semiGlobal.config = {};
});

afterEach(() => {
  semiGlobal.config = {};
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('HotKeys', () => {
  it('按固定 DOM 渲染 hotKeys，并由 content 覆盖显示文本', () => {
    const basic = mount(HotKeysBase, { props: { hotKeys: ['control', 'shift', 'k'] } });
    expect(basic.classes()).toContain('semi-hotKeys');
    expect(basic.findAll('.semi-hotKeys-content').map((node) => node.text())).toEqual([
      'control',
      'shift',
      'k',
    ]);
    expect(basic.findAll('.semi-hotKeys-split').map((node) => node.text())).toEqual(['+', '+']);
    expect(basic.element.children).toHaveLength(3);

    const content = mount(HotKeysBase, {
      props: { content: ['Ctrl', 'K'], hotKeys: ['control', 'k'] },
    });
    expect(content.findAll('.semi-hotKeys-content').map((node) => node.text())).toEqual([
      'Ctrl',
      'K',
    ]);
  });

  it('默认 slot 映射 render，空 slot 不输出根节点', () => {
    const custom = mount(HotKeysBase, {
      props: { hotKeys: ['r'] },
      slots: { default: () => h('strong', { class: 'custom-hot-key' }, 'Run') },
    });
    expect(custom.classes()).toContain('semi-hotKeys');
    expect(custom.get('.custom-hot-key').text()).toBe('Run');
    expect(custom.find('.semi-hotKeys-content').exists()).toBe(false);

    const empty = mount(HotKeysBase, {
      props: { hotKeys: ['r'] },
      slots: { default: () => null },
    });
    expect(empty.html()).toBe('<!--v-if-->');
  });

  it('合并 class/style/attrs，并发出带原生事件的 click', async () => {
    const onClick = vi.fn();
    const wrapper = mount(HotKeysBase, {
      attrs: { 'aria-label': 'Save shortcut', 'data-hot-key': 'save', role: 'note' },
      props: {
        class: 'class-prop',
        className: 'class-name-prop',
        hotKeys: ['control', 's'],
        onClick,
        style: { color: 'red' },
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-hotKeys', 'class-prop', 'class-name-prop']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': 'Save shortcut',
      'data-hot-key': 'save',
      role: 'note',
    });
    expect((wrapper.element as HTMLElement).style.color).toBe('red');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it('公开与固定常量一致的 HotKeys.Keys', () => {
    expect(HotKeys.Keys.Control).toBe('control');
    expect(HotKeys.Keys.Meta).toBe('meta');
    expect(HotKeys.Keys.F12).toBe('f12');
    expect(HotKeys.Keys.NumpadEnter).toBe('numpadenter');
    expect(Object.keys(HotKeys.Keys)).toHaveLength(108);
  });

  it('严格匹配普通键 code 与全部修饰键，并在命中后通知', () => {
    const onHotKey = vi.fn();
    const wrapper = mount(HotKeysBase, {
      props: { hotKeys: ['Control', 'Shift', 'K'], onHotKey },
    });

    keydown(document.body, 'k', 'KeyK', { ctrlKey: true });
    keydown(document.body, 'k', 'KeyK', { altKey: true, ctrlKey: true, shiftKey: true });
    keydown(document.body, 'x', 'KeyX', { ctrlKey: true, shiftKey: true });
    expect(onHotKey).not.toHaveBeenCalled();

    const matched = keydown(document.body, 'K', 'KeyK', { ctrlKey: true, shiftKey: true });
    expect(matched.dispatched).toBe(true);
    expect(onHotKey).toHaveBeenCalledOnce();
    expect(onHotKey).toHaveBeenCalledWith(matched.event);
    wrapper.unmount();
  });

  it('只在成功命中时 preventDefault，并在下一次事件读取更新后的 props', async () => {
    const onHotKey = vi.fn();
    const wrapper = mount(HotKeysBase, {
      props: { hotKeys: ['r'], onHotKey, preventDefault: true },
    });

    const miss = keydown(document.body, 'x', 'KeyX');
    expect(miss.dispatched).toBe(true);
    expect(miss.event.defaultPrevented).toBe(false);
    const hit = keydown(document.body, 'r', 'KeyR');
    expect(hit.dispatched).toBe(false);
    expect(hit.event.defaultPrevented).toBe(true);

    await wrapper.setProps({ hotKeys: ['control', 's'], preventDefault: false });
    await nextTick();
    keydown(document.body, 'r', 'KeyR');
    const updated = keydown(document.body, 's', 'KeyS', { ctrlKey: true });
    expect(updated.dispatched).toBe(true);
    expect(updated.event.defaultPrevented).toBe(false);
    expect(onHotKey).toHaveBeenCalledTimes(2);
  });

  it('getListenerTarget 限定作用域，卸载从实际目标清理', () => {
    const target = document.createElement('section');
    document.body.append(target);
    const onHotKey = vi.fn();
    const wrapper = mount(HotKeysBase, {
      props: { getListenerTarget: () => target, hotKeys: ['enter'], onHotKey },
    });

    keydown(document.body, 'Enter', 'Enter');
    expect(onHotKey).not.toHaveBeenCalled();
    keydown(target, 'Enter', 'Enter');
    expect(onHotKey).toHaveBeenCalledOnce();
    wrapper.unmount();
    keydown(target, 'Enter', 'Enter');
    expect(onHotKey).toHaveBeenCalledOnce();
  });

  it('mergeMetaCtrl 在固定 v2.102.0 Foundation 中保持 no-op', () => {
    const onHotKey = vi.fn();
    const wrapper = mount(HotKeysBase, {
      props: { hotKeys: ['control', 'k'], mergeMetaCtrl: true, onHotKey },
    });
    keydown(document.body, 'k', 'KeyK', { metaKey: true });
    expect(onHotKey).not.toHaveBeenCalled();
    keydown(document.body, 'k', 'KeyK', { ctrlKey: true });
    expect(onHotKey).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('读取 ConfigProvider 全局默认值但显式 false 优先', () => {
    semiGlobal.config.overrideDefaultProps = {
      HotKeys: { content: ['Global', 'R'], preventDefault: true },
    };
    const inherited = mount(HotKeysBase, { props: { hotKeys: ['r'] } });
    expect(inherited.findAll('.semi-hotKeys-content').map((node) => node.text())).toEqual([
      'Global',
      'R',
    ]);
    expect(keydown(document.body, 'r', 'KeyR').event.defaultPrevented).toBe(true);
    inherited.unmount();

    const explicit = mount(HotKeysBase, {
      props: { content: ['Explicit'], hotKeys: ['r'], preventDefault: false },
    });
    expect(explicit.get('.semi-hotKeys-content').text()).toBe('Explicit');
    expect(keydown(document.body, 'r', 'KeyR').event.defaultPrevented).toBe(false);
  });

  it('拒绝未知键、零个普通键和多个普通键，且失败后不遗留监听', () => {
    expect(() => mount(HotKeysBase, { props: { hotKeys: ['unknown-key'] } })).toThrow(
      'unknown-key is not a valid key',
    );
    expect(() => mount(HotKeysBase, { props: { hotKeys: ['control', 'shift'] } })).toThrow(
      'HotKeys must have one common key and 0/some modifier key',
    );
    expect(() => mount(HotKeysBase, { props: { hotKeys: ['a', 'b'] } })).toThrow(
      'HotKeys must have one common key and 0/some modifier key',
    );
  });
});
