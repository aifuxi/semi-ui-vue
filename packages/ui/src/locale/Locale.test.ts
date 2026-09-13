/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef, type Component } from 'vue';
import { describe, expect, it } from 'vitest';

import { ConfigProvider, type SemiLocale } from '../config-provider';
import LocaleConsumer from './LocaleConsumer.vue';
import LocaleProvider from './LocaleProvider.vue';
import type { LocaleConsumerSlotProps } from './types';

const localeModules = import.meta.glob<{ default: Readonly<SemiLocale> }>('./source/*.ts', {
  eager: true,
});

function consumer(
  componentName: string,
  render: (payload: LocaleConsumerSlotProps<Record<string, unknown> | undefined>) => string,
) {
  return h(
    LocaleConsumer as Component,
    { componentName },
    {
      default: (payload: LocaleConsumerSlotProps<Record<string, unknown> | undefined>) =>
        h('span', { class: 'locale-probe' }, render(payload)),
    },
  );
}

describe('LocaleProvider / LocaleConsumer', () => {
  it('脱离 Provider 时使用固定 zh_CN，并暴露四项具名 slot 数据', () => {
    const wrapper = mount(LocaleConsumer as Component, {
      props: { componentName: 'Pagination' },
      slots: {
        default: (payload: LocaleConsumerSlotProps<{ jumpTo: string }>) =>
          h(
            'span',
            `${payload.localeCode}|${payload.currency}|${payload.localeData.jumpTo}|${payload.dateFnsLocale.code}`,
          ),
      },
    });

    expect(wrapper.text()).toBe('zh-CN|CNY|跳至|zh-CN');
  });

  it('Provider prop 更新驱动 Consumer，嵌套 Provider 保持实例隔离', async () => {
    const outer = shallowRef<SemiLocale>({
      code: 'outer',
      currency: 'OUT',
      Widget: { label: 'Outer' },
    });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            LocaleProvider,
            { locale: outer.value },
            {
              default: () => [
                consumer(
                  'Widget',
                  ({ localeCode, localeData }) => `${localeCode}:${String(localeData?.label)}`,
                ),
                h(
                  LocaleProvider,
                  { locale: { code: 'inner', Widget: { label: 'Inner' } } },
                  {
                    default: () =>
                      consumer(
                        'Widget',
                        ({ localeCode, localeData }) =>
                          `${localeCode}:${String(localeData?.label)}`,
                      ),
                  },
                ),
              ],
            },
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.findAll('.locale-probe').map((probe) => probe.text())).toEqual([
      'outer:Outer',
      'inner:Inner',
    ]);

    outer.value = { code: 'updated', Widget: { label: 'Updated' } };
    await nextTick();
    expect(wrapper.findAll('.locale-probe').map((probe) => probe.text())).toEqual([
      'updated:Updated',
      'inner:Inner',
    ]);
  });

  it('ConfigProvider 优先于 LocaleProvider，并响应 componentName 更新', async () => {
    const componentName = shallowRef('First');
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ConfigProvider,
            {
              locale: {
                code: 'config',
                currency: 'CFG',
                First: { label: 'First value' },
                Second: { label: 'Second value' },
              },
            },
            {
              default: () =>
                h(
                  LocaleProvider,
                  { locale: { code: 'locale-provider', First: { label: 'Ignored' } } },
                  {
                    default: () =>
                      consumer(
                        componentName.value,
                        ({ localeCode, currency, localeData }) =>
                          `${localeCode}:${currency}:${String(localeData?.label)}`,
                      ),
                  },
                ),
            },
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.get('.locale-probe').text()).toBe('config:CFG:First value');

    componentName.value = 'Second';
    await nextTick();
    expect(wrapper.get('.locale-probe').text()).toBe('config:CFG:Second value');
  });

  it('缺少 code 时整体回退 zh_CN，有 code 时只回退 dateFnsLocale', () => {
    const wrapper = mount(LocaleProvider, {
      props: {
        locale: {
          currency: 'BAD',
          Pagination: { jumpTo: 'Wrong', page: 'wrong', pageSize: 'wrong', total: 'wrong' },
        },
      },
      slots: {
        default: () =>
          consumer(
            'Pagination',
            ({ localeCode, currency, localeData, dateFnsLocale }) =>
              `${localeCode}|${currency}|${String(localeData?.jumpTo)}|${dateFnsLocale.code}`,
          ),
      },
    });
    expect(wrapper.get('.locale-probe').text()).toBe('zh-CN|CNY|跳至|zh-CN');

    const custom = mount(LocaleProvider, {
      props: { locale: { code: 'custom', currency: 'CUS', Widget: { label: 'Custom' } } },
      slots: {
        default: () =>
          consumer(
            'Missing',
            ({ localeCode, currency, localeData, dateFnsLocale }) =>
              `${localeCode}|${currency}|${String(localeData)}|${dateFnsLocale.code}`,
          ),
      },
    });
    expect(custom.get('.locale-probe').text()).toBe('custom|CUS|undefined|zh-CN');
  });

  it('57 个固定语言 facade 均可默认导入并包含可渲染组件数据', () => {
    const entries = Object.entries(localeModules).sort(([left], [right]) =>
      left.localeCompare(right),
    );
    expect(entries).toHaveLength(57);

    for (const [modulePath, localeModule] of entries) {
      expect(modulePath).toMatch(/^\.\/source\/[A-Za-z0-9_]+\.ts$/);
      expect(localeModule.default.code, modulePath).toBeTypeOf('string');
      expect(localeModule.default.code?.length, modulePath).toBeGreaterThan(0);
      expect(localeModule.default.dateFnsLocale?.code, modulePath).toBeTypeOf('string');
      expect(localeModule.default.Pagination, modulePath).toBeTypeOf('object');
      expect(localeModule.default.TimePicker, modulePath).toBeTypeOf('object');
    }
  });
});
