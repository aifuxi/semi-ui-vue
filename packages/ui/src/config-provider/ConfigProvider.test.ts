/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, inject, nextTick, onMounted, shallowRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Text } from '../typography';

import ConfigProvider, {
  ConfigConsumer,
  configContextKey,
  defaultResponsiveMap,
  semiGlobal,
  type ConfigContextValue,
  type SemiLocale,
} from './index';

interface MatchMediaController {
  emit(media: string, matches: boolean): void;
  listeners: Map<string, Set<(event: MediaQueryListEvent) => void>>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

function installMatchMedia(matches: Record<string, boolean>): MatchMediaController {
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();
  const removeEventListener = vi.fn(
    (media: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.get(media)?.delete(listener);
    },
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media: string) => ({
      media,
      matches: matches[media] ?? false,
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        const mediaListeners = listeners.get(media) ?? new Set();
        mediaListeners.add(listener);
        listeners.set(media, mediaListeners);
      },
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        removeEventListener(media, listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  return {
    listeners,
    removeEventListener,
    emit(media, nextMatches) {
      matches[media] = nextMatches;
      for (const listener of listeners.get(media) ?? []) {
        listener({ matches: nextMatches, media } as MediaQueryListEvent);
      }
    },
  };
}

describe('ConfigProvider', () => {
  beforeEach(() => {
    semiGlobal.config = {};
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('默认不增加 DOM，RTL 时增加固定 semi-rtl 包装', async () => {
    const wrapper = mount(ConfigProvider, {
      slots: { default: () => h('span', { class: 'content' }, 'Content') },
    });
    expect(wrapper.get('.content').element.tagName).toBe('SPAN');
    expect(wrapper.find('.semi-rtl').exists()).toBe(false);

    await wrapper.setProps({ direction: 'rtl' });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('semi-rtl');
    expect(wrapper.get('.content').text()).toBe('Content');
  });

  it('ConfigConsumer 获取响应式配置，嵌套 Provider 保持实例隔离', () => {
    const outerLocale: SemiLocale = { code: 'outer' };
    const innerLocale: SemiLocale = { code: 'inner' };
    const Probe = defineComponent({
      setup() {
        const context = inject(configContextKey)!;
        return () =>
          h('span', { class: 'probe' }, `${context.value.locale.code}:${context.value.direction}`);
      },
    });
    const wrapper = mount(ConfigProvider, {
      props: { locale: outerLocale, direction: 'rtl' },
      slots: {
        default: () => [
          h(Probe, { class: 'outer' }),
          h(
            ConfigProvider,
            { locale: innerLocale, direction: 'ltr' },
            { default: () => h(Probe, { class: 'inner' }) },
          ),
        ],
      },
    });
    expect(wrapper.findAll('.probe').map((probe) => probe.text())).toEqual([
      'outer:rtl',
      'inner:ltr',
    ]);
  });

  it('ConfigConsumer scoped slot 暴露公开上下文并提供脱离 Provider 的默认值', () => {
    const wrapper = mount(ConfigConsumer, {
      slots: {
        default: (context: ConfigContextValue) =>
          h('span', { class: 'consumer' }, `${context.direction}:${context.locale.code}`),
      },
    });
    expect(wrapper.get('.consumer').text()).toBe('ltr:zh-CN');
  });

  it('统一 locale 注入可驱动 Typography，并响应 locale prop 变化', async () => {
    const english: SemiLocale = {
      code: 'en-US',
      Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
    };
    const wrapper = mount(ConfigProvider, {
      props: { locale: english },
      slots: { default: () => h(Text, { copyable: true }, () => 'Token') },
    });
    expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe('Copy');

    await wrapper.setProps({
      locale: {
        code: 'custom',
        Typography: { copy: '复制它', copied: '已复制', expand: '展开', collapse: '收起' },
      },
    });
    expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe('复制它');
  });

  it('首次订阅时读取断点，过滤变更回调并在最后取消订阅时清理', async () => {
    const media = installMatchMedia({
      [defaultResponsiveMap.xs]: false,
      [defaultResponsiveMap.md]: true,
      [defaultResponsiveMap.lg]: true,
    });
    const snapshots: string[] = [];
    const changes: string[] = [];
    const unsubscribers: Array<() => void> = [];
    const Probe = defineComponent({
      setup() {
        const context = inject(configContextKey)!;
        onMounted(() => {
          unsubscribers.push(
            context.value.onBreakpoint((screens) => snapshots.push(JSON.stringify(screens))),
          );
          unsubscribers.push(
            context.value.onBreakpoint(['md'], (screen, match) =>
              changes.push(`${screen}:${String(match)}`),
            ),
          );
        });
        return () => h('span', 'Probe');
      },
    });
    const wrapper = mount(ConfigProvider, {
      props: { responsiveObserve: true },
      slots: { default: () => h(Probe) },
    });

    expect(JSON.parse(snapshots[0]!)).toMatchObject({ xs: false, md: true, lg: true });
    expect(changes).toEqual(['md:true']);
    media.emit(defaultResponsiveMap.md, false);
    await nextTick();
    expect(changes).toEqual(['md:true', 'md:false']);
    media.emit(defaultResponsiveMap.lg, false);
    await nextTick();
    expect(changes).toEqual(['md:true', 'md:false']);
    expect(JSON.parse(snapshots.at(-1)!)).toMatchObject({ md: false, lg: false });

    for (const unsubscribe of unsubscribers) unsubscribe();
    expect(media.removeEventListener).toHaveBeenCalledTimes(6);
    wrapper.unmount();
  });

  it('默认关闭断点观察，订阅只返回全 false 且不会访问 matchMedia', () => {
    installMatchMedia({});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const snapshot = shallowRef<Readonly<Record<string, boolean>>>();
    const Probe = defineComponent({
      setup() {
        const context = inject(configContextKey)!;
        onMounted(() => context.value.onBreakpoint((screens) => (snapshot.value = screens)));
        return () => h('span', 'Probe');
      },
    });
    mount(ConfigProvider, { slots: { default: () => h(Probe) } });
    expect(snapshot.value).toEqual({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    });
    expect(window.matchMedia).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('公开默认断点与 semiGlobal 单例配置', () => {
    expect(ConfigProvider.defaultResponsiveMap).toBe(defaultResponsiveMap);
    semiGlobal.config.overrideDefaultProps = { Select: { zIndex: 2000 } };
    expect(semiGlobal.config.overrideDefaultProps?.Select).toEqual({ zIndex: 2000 });
  });

  it('SSR-safe 渲染 LTR/RTL 与 Consumer', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          ConfigProvider,
          { direction: 'rtl', timeZone: 'Asia/Shanghai' },
          {
            default: () =>
              h(ConfigConsumer, null, {
                default: (context: ConfigContextValue) =>
                  h('span', { 'data-zone': context.timeZone }, context.direction),
              }),
          },
        ),
    });
    const html = await renderToString(app);
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('data-zone="Asia/Shanghai"');
    expect(html).toContain('>rtl</span>');
  });
});
