import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import { ConfigProvider } from '../config-provider';
import TreeSelect from './TreeSelect.vue';
import type { TreeNodeData, TreeSelectExposed } from './types';

const treeData: TreeNodeData[] = [
  {
    key: 'asia',
    label: 'Asia',
    value: 'asia',
    children: [
      { key: 'china', label: 'China', value: 'china' },
      { key: 'japan', label: 'Japan', value: 'japan', disabled: true },
    ],
  },
  { key: 'europe', label: 'Europe', value: 'europe' },
];

async function open(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('.semi-tree-select').trigger('click');
  await nextTick();
  await flushPromises();
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('TreeSelect', () => {
  it('renders the upstream trigger classes and combobox aria contract', () => {
    const wrapper = mount(TreeSelect, {
      props: {
        treeData,
        ariaDescribedby: 'help',
        ariaRequired: true,
        size: 'large',
        validateStatus: 'warning',
      },
    });
    const trigger = wrapper.get('.semi-tree-select');
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-haspopup')).toBe('dialog');
    expect(trigger.attributes('aria-label')).toBe('TreeSelect');
    expect(trigger.attributes('aria-describedby')).toBe('help');
    expect(trigger.attributes('aria-required')).toBe('true');
    expect(trigger.classes()).toEqual(
      expect.arrayContaining([
        'semi-tree-select-single',
        'semi-tree-select-large',
        'semi-tree-select-warning',
      ]),
    );
  });

  it('opens in a stable custom popup container and closes with Escape', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const visibleChange = vi.fn();
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        motion: false,
        getPopupContainer: () => container,
        onVisibleChange: visibleChange,
      },
    });
    await open(wrapper);
    expect(container.querySelector('.semi-tree-select-popover')).not.toBeNull();
    expect(
      container.querySelector(
        '.semi-tree-select-popover > .semi-tree-wrapper > .semi-tree-option-list',
      ),
    ).not.toBeNull();
    expect(
      container.querySelector('.semi-tree-select-popover .semi-tree-wrapper .semi-tree-wrapper'),
    ).toBeNull();
    expect(visibleChange).toHaveBeenCalledWith(true);
    await wrapper.get('.semi-tree-select').trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(container.querySelector('.semi-tree-select-popover')).toBeNull();
    expect(visibleChange).toHaveBeenLastCalledWith(false);
  });

  it('emits select before change/update and closes after a single selection', async () => {
    const order: string[] = [];
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        defaultExpandAll: true,
        motion: false,
        onSelect: () => order.push('select'),
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('update'),
        onVisibleChange: (visible) => order.push(`visible:${visible}`),
      },
    });
    await open(wrapper);
    const china = document.body.querySelectorAll<HTMLElement>('.semi-tree-option')[1];
    expect(china?.textContent).toContain('China');
    china?.click();
    await nextTick();
    expect(order).toEqual(['visible:true', 'select', 'change', 'update', 'visible:false']);
    expect(wrapper.get('.semi-tree-select-selection-content').text()).toBe('China');
  });

  it('keeps controlled value rendering authoritative', async () => {
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        modelValue: 'china',
        defaultExpandAll: true,
        motion: false,
      },
    });
    expect(wrapper.get('.semi-tree-select-selection-content').text()).toBe('China');
    await open(wrapper);
    document.body.querySelectorAll<HTMLElement>('.semi-tree-option')[3]?.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('europe');
    expect(wrapper.get('.semi-tree-select-selection-content').text()).toBe('China');
  });

  it('supports related multiple selection, merged tags and tag removal', async () => {
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        multiple: true,
        defaultExpandAll: true,
        motion: false,
      },
    });
    await open(wrapper);
    document.body.querySelector<HTMLElement>('.semi-tree-option')?.click();
    await nextTick();
    const latest = wrapper.emitted('change')?.at(-1)?.[0] as string[];
    expect(latest).toEqual(['asia']);
    expect(wrapper.findAll('.semi-tag')).toHaveLength(1);
    expect(wrapper.text()).toContain('Asia');
    await wrapper.get('.semi-tag-close').trigger('click');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([]);
  });

  it('filters locally and reports matching nodes', async () => {
    const search = vi.fn();
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        filterTreeNode: true,
        showFilteredOnly: true,
        defaultExpandAll: true,
        motion: false,
        onSearch: search,
      },
    });
    await open(wrapper);
    const input = document.body.querySelector<HTMLInputElement>('.semi-tree-select-popover input');
    expect(input).not.toBeNull();
    input!.value = 'China';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    await flushPromises();
    expect(search).toHaveBeenLastCalledWith('China', ['asia'], [treeData[0]!.children![0]]);
    expect(document.body.querySelectorAll('.semi-tree-option')).toHaveLength(2);
  });

  it('remote search only emits and does not remove local options', async () => {
    const search = vi.fn();
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        filterTreeNode: true,
        remote: true,
        defaultExpandAll: true,
        motion: false,
        onSearch: search,
      },
    });
    await open(wrapper);
    (wrapper.vm as unknown as TreeSelectExposed).search('missing');
    await nextTick();
    expect(search).toHaveBeenLastCalledWith('missing', [], []);
    expect(document.body.querySelectorAll('.semi-tree-option')).toHaveLength(4);
  });

  it('clears value with keyboard and preserves disabled tags', async () => {
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: {
        treeData,
        multiple: true,
        defaultValue: ['china', 'japan'],
        defaultExpandAll: true,
        showClear: true,
        motion: false,
      },
    });
    await open(wrapper);
    await wrapper.get('.semi-tree-select').trigger('mouseenter');
    const clear = wrapper.get('.semi-tree-select-clearbtn');
    await clear.trigger('keypress', { key: 'Enter' });
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([]);
  });

  it('distinguishes omitted, explicit false and explicit true clickTriggerToHide', async () => {
    const omitted = mount(TreeSelect, {
      attachTo: document.body,
      props: { treeData, motion: false },
    });
    await open(omitted);
    await omitted.get('.semi-tree-select').trigger('click');
    expect(document.body.querySelector('.semi-tree-select-popover')).toBeNull();
    omitted.unmount();

    const explicitFalse = mount(TreeSelect, {
      attachTo: document.body,
      props: { treeData, clickTriggerToHide: false, motion: false },
    });
    await open(explicitFalse);
    await explicitFalse.get('.semi-tree-select').trigger('click');
    expect(document.body.querySelector('.semi-tree-select-popover')).not.toBeNull();
    explicitFalse.unmount();

    const explicitTrue = mount(TreeSelect, {
      attachTo: document.body,
      props: { treeData, clickTriggerToHide: true, motion: false },
    });
    await open(explicitTrue);
    await explicitTrue.get('.semi-tree-select').trigger('click');
    expect(document.body.querySelector('.semi-tree-select-popover')).toBeNull();
  });

  it('uses ConfigProvider locale and supports Vue render slots', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ConfigProvider,
            { locale: { code: 'en-US', TreeSelect: { searchPlaceholder: 'Find node' } } },
            {
              default: () =>
                h(
                  TreeSelect,
                  { treeData, filterTreeNode: true, motion: false },
                  {
                    prefix: () => 'Region',
                    label: ({ label }: { label?: unknown }) => h('strong', String(label ?? '')),
                  },
                ),
            },
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    expect(wrapper.get('.semi-tree-select-prefix').text()).toBe('Region');
    await open(wrapper);
    expect(
      document.body.querySelector<HTMLInputElement>('.semi-tree-select-popover input')?.placeholder,
    ).toBe('Find node');
    expect(document.body.querySelector('.semi-tree-option strong')?.textContent).toBe('Asia');
  });

  it('removes the document click listener on unmount', async () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(TreeSelect, { props: { treeData } });
    await open(wrapper);
    const handler = add.mock.calls.find(([name]) => name === 'mousedown')?.[1];
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('mousedown', handler);
  });
});
