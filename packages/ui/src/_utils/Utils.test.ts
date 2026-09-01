import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IconHome } from '@aifuxi/semi-icons-vue';
import { semiGlobal as configSemiGlobal } from '../config-provider';
import {
  cloneDeep,
  getActiveElement,
  getDefaultPropsFromGlobalConfig,
  getFocusableElements,
  getScrollbarWidth,
  isNodeContainsFocus,
  isSemiIcon,
  registerMediaQuery,
  runAfterTicks,
  semiGlobal,
  stopPropagation,
} from './index';
import { usePrevFocus } from './use-prev-focus';
import { getRef, render, resolveDOM, unmount } from './vue-render';

afterEach(() => {
  semiGlobal.config = {};
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('_utils', () => {
  it('stopPropagation 支持 immediate stop 与 noImmediate', () => {
    const stop = vi.fn();
    const immediate = vi.fn();
    stopPropagation({
      stopPropagation: stop,
      nativeEvent: { stopImmediatePropagation: immediate },
    });
    expect(stop).toHaveBeenCalledOnce();
    expect(immediate).toHaveBeenCalledOnce();
    stopPropagation(
      { stopPropagation: stop, nativeEvent: { stopImmediatePropagation: immediate } },
      true,
    );
    expect(stop).toHaveBeenCalledTimes(2);
    expect(immediate).toHaveBeenCalledOnce();
  });

  it('cloneDeep 深拷贝数据但保留函数、VNode 与 Error 身份', () => {
    const callback = () => undefined;
    const node = h('span', 'node');
    const error = new Error('probe');
    const source = { nested: { value: 1 }, callback, node, error };
    const cloned = cloneDeep(source);
    expect(cloned).not.toBe(source);
    expect(cloned.nested).not.toBe(source.nested);
    expect(cloned).toEqual(source);
    expect(cloned.callback).toBe(callback);
    expect(cloned.node).toBe(node);
    expect(cloned.error).toBe(error);
    expect(cloneDeep({ token: 'old' }, (value) => (value === 'old' ? 'new' : undefined))).toEqual({
      token: 'new',
    });
  });

  it('registerMediaQuery 调用初值、变更回调并清理现代监听', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const remove = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        media: '(min-width: 1px)',
        onchange: null,
        addEventListener: (_type: string, next: (event: MediaQueryListEvent) => void) => {
          listener = next;
        },
        removeEventListener: remove,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    const match = vi.fn();
    const unmatch = vi.fn();
    const unregister = registerMediaQuery('(min-width: 1px)', { match, unmatch });
    expect(match).toHaveBeenCalledOnce();
    listener?.({ matches: false } as MediaQueryListEvent);
    expect(unmatch).toHaveBeenCalledOnce();
    unregister();
    expect(remove).toHaveBeenCalledWith('change', listener);
  });

  it('registerMediaQuery 支持 legacy listener 且可跳过初值', () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(
        () =>
          ({
            matches: false,
            addListener,
            removeListener,
          }) as unknown as MediaQueryList,
      ),
    );
    const unmatch = vi.fn();
    const unregister = registerMediaQuery('(legacy)', { unmatch, callInInit: false });
    expect(unmatch).not.toHaveBeenCalled();
    expect(addListener).toHaveBeenCalledOnce();
    unregister();
    expect(removeListener).toHaveBeenCalledOnce();
  });

  it('识别 Semi Icon，并查询焦点与可聚焦元素', () => {
    expect(isSemiIcon(h(IconHome))).toBe(true);
    expect(isSemiIcon(h('svg'))).toBe(false);
    const root = document.createElement('div');
    root.innerHTML = '<button>One</button><button disabled>Disabled</button><a href="#x">Link</a>';
    document.body.append(root);
    const button = root.querySelector('button')!;
    button.focus();
    expect(getActiveElement()).toBe(button);
    expect(isNodeContainsFocus(root)).toBe(true);
    expect(getFocusableElements(root).map((element) => element.textContent)).toEqual([
      'One',
      'Link',
    ]);
  });

  it('runAfterTicks 等待指定 macrotask，滚动条宽度按 viewport 计算', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const pending = runAfterTicks(callback, 2);
    expect(callback).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();
    await pending;
    expect(callback).toHaveBeenCalledOnce();

    vi.stubGlobal('innerWidth', 1200);
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1184,
    });
    expect(getScrollbarWidth()).toBe(16);
  });

  it('全局默认值代理动态读取唯一 semiGlobal 单例', () => {
    expect(semiGlobal).toBe(configSemiGlobal);
    const defaults = getDefaultPropsFromGlobalConfig('Probe', { size: 'default', visible: true });
    expect(defaults).toEqual({ size: 'default', visible: true });
    semiGlobal.config.overrideDefaultProps = { Probe: { size: 'small', disabled: false } };
    expect(defaults.size).toBe('small');
    expect(Object.keys(defaults).sort()).toEqual(['disabled', 'size', 'visible']);
    defaults.size = 'large';
    expect(defaults.size).toBe('small');
  });

  it('usePrevFocus 在替换与卸载时 blur 对应元素', async () => {
    const first = document.createElement('input');
    const second = document.createElement('input');
    document.body.append(first, second);
    first.focus();
    const firstBlur = vi.spyOn(first, 'blur');
    const secondBlur = vi.spyOn(second, 'blur');
    let setPreviousFocus: ((element: HTMLElement | null) => void) | undefined;
    const Host = defineComponent({
      setup() {
        const [, setter] = usePrevFocus();
        setPreviousFocus = setter;
        return () => h('span', 'focus');
      },
    });
    const wrapper = mount(Host);
    setPreviousFocus?.(second);
    await nextTick();
    expect(firstBlur).toHaveBeenCalledOnce();
    wrapper.unmount();
    expect(secondBlur).toHaveBeenCalledOnce();
  });

  it('Vue 命令式 render/unmount、DOM 与 VNode ref 解析可用', async () => {
    const container = document.createElement('div');
    const node = h('span', { ref: 'probe' }, 'Rendered');
    render(node, container);
    await nextTick();
    expect(container.textContent).toBe('Rendered');
    const span = container.querySelector('span')!;
    expect(resolveDOM(span)).toBe(span);
    expect(resolveDOM({ $el: span })).toBe(span);
    expect(resolveDOM({ $el: document.createTextNode('text') })).toBeNull();
    expect(getRef(node)).not.toBeNull();
    unmount(container);
    expect(container.innerHTML).toBe('');
  });
});
