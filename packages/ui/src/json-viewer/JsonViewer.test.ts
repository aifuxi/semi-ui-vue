import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { computed, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import enUS from '../locale/source/en_US';
import JsonViewer from './JsonViewer.vue';
import type { JsonViewerExposed } from './types';

class TestWorker {
  static instances: TestWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  terminate = vi.fn();
  private value = '';

  constructor() {
    TestWorker.instances.push(this);
  }

  postMessage(message: {
    messageId: number;
    method: string;
    params: Record<string, unknown>;
  }): void {
    if (message.method === 'init') this.value = String(message.params.value ?? '');
    const result =
      message.method === 'validate'
        ? { problems: [], root: null }
        : message.method === 'foldRange'
          ? []
          : message.method === 'format'
            ? this.value
            : undefined;
    queueMicrotask(() => {
      this.onmessage?.({ data: { messageId: message.messageId, result } } as MessageEvent);
    });
  }
}

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }

  notify(width: number): void {
    this.callback(
      [{ contentRect: { width } } as unknown as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
}

const source = `{
  "name": "Semi",
  "version": 102,
  "enabled": true
}`;

function mountViewer(
  props: Record<string, unknown> = {},
  locale?: ConfigContextValue['locale'],
): VueWrapper {
  return mount(JsonViewer, {
    attachTo: document.body,
    attrs: { class: 'attr-class', 'data-viewer': 'unit' },
    props: { value: source, ...props },
    global: {
      ...(locale
        ? {
            provide: {
              [configContextKey as symbol]: computed(
                () => ({ direction: 'ltr', locale }) as ConfigContextValue,
              ),
            },
          }
        : {}),
    },
  });
}

beforeEach(() => {
  TestWorker.instances = [];
  TestResizeObserver.instances = [];
  vi.stubGlobal('Worker', TestWorker);
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }),
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('JsonViewer', () => {
  it('保留根 attrs/class/style/尺寸并区分 showSearch 三态', async () => {
    const omitted = mountViewer({ className: 'named', width: 520, height: '180px' });
    await flushPromises();
    expect(omitted.classes()).toEqual(expect.arrayContaining(['named', 'attr-class']));
    expect(omitted.attributes('data-viewer')).toBe('unit');
    expect((omitted.element as HTMLElement).style.width).toBe('520px');
    expect((omitted.element as HTMLElement).style.height).toBe('180px');
    expect(omitted.find('.semi-json-viewer-search-bar-trigger').exists()).toBe(true);

    const hidden = mountViewer({ showSearch: false });
    await flushPromises();
    expect(hidden.find('.semi-json-viewer-search-bar-trigger').exists()).toBe(false);

    const shown = mountViewer({ showSearch: true });
    await flushPromises();
    expect(shown.find('.semi-json-viewer-search-bar-trigger').exists()).toBe(true);
  });

  it('打开搜索栏、使用英文 Locale、切换匹配项并在关闭时重置', async () => {
    const wrapper = mountViewer({}, enUS);
    await flushPromises();
    await wrapper.get('.semi-json-viewer-search-bar-trigger').trigger('click');
    expect(wrapper.find('input[placeholder="Search"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Replace All');

    const wholeWord = wrapper.get('[aria-label="Whole word"]');
    await wholeWord.trigger('click');
    expect(wholeWord.attributes('aria-pressed')).toBe('true');
    await wrapper.get('[aria-label="Close search"]').trigger('click');
    await wrapper.get('.semi-json-viewer-search-bar-trigger').trigger('click');
    expect(wrapper.get('[aria-label="Whole word"]').attributes('aria-pressed')).toBe('false');
  });

  it('公开方法读取值、搜索、导航并在只读态阻止替换', async () => {
    const wrapper = mountViewer({ options: { readOnly: true, autoWrap: true } });
    await flushPromises();
    const exposed = wrapper.vm as unknown as JsonViewerExposed;
    expect(exposed.getValue()).toBe(source);
    exposed.search('Semi');
    expect(exposed.getSearchResults()).toHaveLength(1);
    exposed.nextSearch();
    exposed.prevSearch();
    exposed.replace('Vue');
    exposed.replaceAll('Vue');
    expect(exposed.getValue()).toBe(source);

    await wrapper.get('.semi-json-viewer-search-bar-trigger').trigger('click');
    const replaceButtons = wrapper.findAll('.semi-json-viewer-replace-bar button');
    expect(replaceButtons).toHaveLength(2);
    expect(replaceButtons.every((button) => button.attributes('disabled') === '')).toBe(true);
  });

  it('编辑后按顺序发出 change 与 update:value', async () => {
    const wrapper = mountViewer();
    await flushPromises();
    const exposed = wrapper.vm as unknown as JsonViewerExposed;
    exposed.search('Semi');
    exposed.replace('Vue');
    await flushPromises();
    const nextValue = source.replace('Semi', 'Vue');
    expect(wrapper.emitted('change')?.at(-1)).toEqual([nextValue]);
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([nextValue]);
  });

  it('把 customRenderRule 的 Vue VNode 挂入 core 占位节点', async () => {
    const wrapper = mountViewer({
      value: '{"name":"Semi"}',
      options: {
        readOnly: true,
        autoWrap: true,
        customRenderRule: [
          {
            match: 'Semi',
            render: (content: string) => h('strong', { class: 'custom-name' }, content),
          },
        ],
      },
    });
    await flushPromises();
    expect(wrapper.get('.custom-name').text()).toBe('"Semi"');
  });

  it('向 renderSearchButton 与 slot 暴露稳定控制器', async () => {
    const renderSearchButton = vi.fn((defaultNode, controls) =>
      h(
        'button',
        { class: 'custom-search', onClick: controls.onToggleSearchBar },
        controls.showSearchBar ? defaultNode : 'Custom search',
      ),
    );
    const wrapper = mountViewer({ renderSearchButton });
    await flushPromises();
    expect(wrapper.get('.custom-search').text()).toBe('Custom search');
    await wrapper.get('.custom-search').trigger('click');
    await nextTick();
    expect(renderSearchButton.mock.calls.at(-1)?.[1].showSearchBar).toBe(true);
    expect(wrapper.find('.semi-json-viewer-search-bar').exists()).toBe(true);
  });

  it('宽度变化合并 layout，options/value 重建并在卸载时终止 Worker 与 Observer', async () => {
    const wrapper = mountViewer();
    await flushPromises();
    expect(TestWorker.instances).toHaveLength(1);
    expect(TestResizeObserver.instances).toHaveLength(1);
    TestResizeObserver.instances[0]!.notify(399);
    expect(requestAnimationFrame).toHaveBeenCalled();

    await wrapper.setProps({ value: '{"next":true}' });
    await flushPromises();
    expect(TestWorker.instances).toHaveLength(2);
    expect(TestWorker.instances[0]!.terminate).toHaveBeenCalledOnce();
    expect(TestResizeObserver.instances[0]!.disconnect).toHaveBeenCalledOnce();

    await wrapper.setProps({ options: { readOnly: true, autoWrap: false } });
    await flushPromises();
    expect(TestWorker.instances).toHaveLength(3);
    expect(TestResizeObserver.instances).toHaveLength(2);
    wrapper.unmount();
    expect(TestWorker.instances[2]!.terminate).toHaveBeenCalledOnce();
  });
});
