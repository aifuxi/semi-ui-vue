import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { Popover } from '../popover';
import Cascader from './Cascader.vue';
import type { CascaderData, CascaderExposed } from './types';

const treeData: CascaderData[] = [
  {
    label: 'Asia',
    value: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        children: [
          { label: 'Beijing', value: 'beijing' },
          { label: 'Shanghai', value: 'shanghai', disabled: true },
        ],
      },
      { label: 'Japan', value: 'japan' },
    ],
  },
  { label: 'Europe', value: 'europe' },
];

async function open(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('.semi-cascader').trigger('click');
  await nextTick();
  await flushPromises();
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Cascader', () => {
  it('keeps omitted, explicit false and template-bare true popup Boolean semantics', () => {
    const Host = defineComponent({
      components: { Cascader },
      setup: () => ({ treeData }),
      template: `
        <div>
          <Cascader data-kind="omitted" :tree-data="treeData" />
          <Cascader data-kind="false" :tree-data="treeData" :auto-adjust-overflow="false" :auto-clear-search-value="false" :motion="false" :stop-propagation="false" />
          <Cascader data-kind="true" :tree-data="treeData" auto-adjust-overflow auto-clear-search-value motion stop-propagation />
        </div>
      `,
    });
    const wrapper = mount(Host);
    const cascaders = wrapper.findAllComponents(Cascader);
    const popupProps = cascaders.map((item) => item.findComponent(Popover).props());
    expect(popupProps.map((item) => item.autoAdjustOverflow)).toEqual([true, false, true]);
    expect(popupProps.map((item) => item.motion)).toEqual([true, false, true]);
    expect(popupProps.map((item) => item.stopPropagation)).toEqual([true, false, true]);
    expect(cascaders.map((item) => item.props('autoClearSearchValue'))).toEqual([
      true,
      false,
      true,
    ]);
  });

  it('renders the upstream trigger and aria contract', () => {
    const wrapper = mount(Cascader, {
      props: {
        treeData,
        ariaDescribedby: 'help',
        ariaRequired: true,
        size: 'large',
        validateStatus: 'warning',
      },
    });
    const trigger = wrapper.get('.semi-cascader');
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-label')).toBe('Cascader');
    expect(trigger.attributes('aria-describedby')).toBe('help');
    expect(trigger.attributes('aria-required')).toBe('true');
    expect(trigger.classes()).toEqual(
      expect.arrayContaining([
        'semi-cascader-single',
        'semi-cascader-large',
        'semi-cascader-warning',
      ]),
    );
  });

  it('opens in a stable custom container and closes with Escape', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const visibleChange = vi.fn();
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData,
        motion: false,
        getPopupContainer: () => container,
        onVisibleChange: visibleChange,
      },
    });
    await open(wrapper);
    expect(container.querySelector('.semi-cascader-popover')).not.toBeNull();
    expect(visibleChange).toHaveBeenCalledWith(true);
    await wrapper.get('.semi-cascader').trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(container.querySelector('.semi-cascader-popover')).toBeNull();
    expect(visibleChange).toHaveBeenLastCalledWith(false);
  });

  it('selects a leaf in event order and keeps controlled rendering authoritative', async () => {
    const order: string[] = [];
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData,
        modelValue: ['asia', 'japan'],
        motion: false,
        onSelect: () => order.push('select'),
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('update'),
        onVisibleChange: (visible) => order.push(`visible:${visible}`),
      },
    });
    expect(wrapper.text()).toContain('Asia / Japan');
    await open(wrapper);
    const europe = Array.from(
      document.body.querySelectorAll<HTMLElement>('.semi-cascader-option'),
    ).find((item) => item.textContent?.includes('Europe'));
    europe?.click();
    await nextTick();
    expect(order).toEqual(['visible:true', 'select', 'change', 'update', 'visible:false']);
    expect(wrapper.text()).toContain('Asia / Japan');
  });

  it('supports related multiple selection, max and tag removal', async () => {
    const exceed = vi.fn();
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: { treeData, multiple: true, max: 1, motion: false, onExceed: exceed },
    });
    await open(wrapper);
    const asia = document.body.querySelector<HTMLElement>('.semi-cascader-option');
    asia?.querySelector<HTMLInputElement>('input')?.click();
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([['asia']]);
    expect(wrapper.findAll('.semi-tag')).toHaveLength(1);
    const europe = Array.from(
      document.body.querySelectorAll<HTMLElement>('.semi-cascader-option'),
    ).find((item) => item.textContent?.includes('Europe'));
    europe?.querySelector<HTMLInputElement>('input')?.click();
    expect(exceed).toHaveBeenCalledOnce();
    await wrapper.get('.semi-tag-close').trigger('click');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([]);
  });

  it('filters locally, supports remote results and exposes search', async () => {
    const search = vi.fn();
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData,
        filterTreeNode: true,
        searchPosition: 'custom',
        motion: false,
        onSearch: search,
      },
    });
    await open(wrapper);
    (wrapper.vm as unknown as CascaderExposed).search('Japan');
    await nextTick();
    expect(search).toHaveBeenLastCalledWith('Japan');
    expect(document.body.querySelectorAll('.semi-cascader-option-flatten')).toHaveLength(1);
    await wrapper.setProps({ remote: true });
    (wrapper.vm as unknown as CascaderExposed).search('missing');
    await nextTick();
    expect(document.body.querySelectorAll('.semi-cascader-option-flatten').length).toBeGreaterThan(
      1,
    );
  });

  it('maps custom data fields and returns object paths when requested', async () => {
    const customData = [
      {
        name: 'Root',
        id: 'root',
        nodes: [{ name: 'Leaf', id: 1 }],
      },
    ] as unknown as CascaderData[];
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData: customData,
        keyMaps: { label: 'name', value: 'id', children: 'nodes' },
        onChangeWithObject: true,
        motion: false,
      },
    });
    await open(wrapper);
    document.body.querySelector<HTMLElement>('.semi-cascader-option')?.click();
    await nextTick();
    expect(document.body.textContent).toContain('Leaf');
    Array.from(document.body.querySelectorAll<HTMLElement>('.semi-cascader-option'))
      .find((item) => item.textContent?.includes('Leaf'))
      ?.click();
    await nextTick();
    const changed = wrapper.emitted('change')?.at(-1)?.[0] as CascaderData[];
    expect(changed.map((item) => item.id)).toEqual(['root', 1]);
    expect(changed[0]).toMatchObject({ name: 'Root', label: 'Root', value: 'root' });
    expect(changed[1]).toMatchObject({ name: 'Leaf', label: 'Leaf', value: 1 });
  });

  it('loads async children once and emits the loaded key set', async () => {
    const asyncData: CascaderData[] = [{ label: 'Async', value: 'async', isLeaf: false }];
    const loadData = vi.fn(async (options: CascaderData[]) => {
      options[0]!.children = [{ label: 'Loaded', value: 'loaded' }];
    });
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: { treeData: asyncData, loadData, motion: false },
    });
    await open(wrapper);
    document.body.querySelector<HTMLElement>('.semi-cascader-option')?.click();
    await flushPromises();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    expect(loadData).toHaveBeenCalledOnce();
    expect(loadData.mock.calls[0]?.[0]?.[0]).toMatchObject({
      label: 'Async',
      value: 'async',
      children: [{ label: 'Loaded', value: 'loaded' }],
    });
    expect(wrapper.emitted('load')).toHaveLength(1);
    expect(wrapper.emitted('load')?.[0]?.[0]).toEqual(expect.any(Set));
  });

  it('virtualizes search results and keeps list-scroll public', async () => {
    const manyLeaves: CascaderData[] = Array.from({ length: 40 }, (_, index) => ({
      label: `Item ${index}`,
      value: `item-${index}`,
    }));
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData: manyLeaves,
        filterTreeNode: true,
        searchPosition: 'custom',
        virtualizeInSearch: { itemSize: 32, height: 96, width: 240 },
        motion: false,
      },
    });
    (wrapper.vm as unknown as CascaderExposed).search('Item');
    await nextTick();
    const list = document.body.querySelector<HTMLElement>('.semi-cascader-option-list');
    expect(list?.style.height).toBe('96px');
    expect(document.body.querySelectorAll('.semi-cascader-option-flatten').length).toBeLessThan(40);
    list?.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(wrapper.emitted('listScroll')).toHaveLength(1);
  });

  it.each([
    ['omitted', {}, true],
    ['explicit false', { autoMergeValue: false }, false],
    ['explicit true', { autoMergeValue: true }, true],
  ] as const)('keeps %s autoMergeValue semantics', async (_label, extraProps, merged) => {
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: { treeData, multiple: true, motion: false, ...extraProps },
    });
    await open(wrapper);
    document.body.querySelector<HTMLElement>('.semi-cascader-option input')?.click();
    await nextTick();
    const value = wrapper.emitted('change')?.at(-1)?.[0] as unknown[][];
    expect(value.length === 1).toBe(merged);
  });

  it.each([
    ['omitted', {}, 3],
    ['explicit false', { filterLeafOnly: false }, 5],
    ['explicit true', { filterLeafOnly: true }, 3],
  ] as const)('keeps %s filterLeafOnly semantics', async (_label, extraProps, count) => {
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: {
        treeData,
        filterTreeNode: true,
        searchPosition: 'custom',
        motion: false,
        ...extraProps,
      },
    });
    (wrapper.vm as unknown as CascaderExposed).search('Asia');
    await nextTick();
    expect(document.body.querySelectorAll('.semi-cascader-option-flatten')).toHaveLength(count);
  });

  it('clears with Enter and removes its document listener on unmount', async () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(Cascader, {
      attachTo: document.body,
      props: { treeData, defaultValue: ['europe'], showClear: true, motion: false },
    });
    await open(wrapper);
    await wrapper.get('.semi-cascader').trigger('mouseenter');
    await wrapper.get('.semi-cascader-clearbtn').trigger('keypress', { key: 'Enter' });
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([]);
    const handler = add.mock.calls.find(([name]) => name === 'mousedown')?.[1];
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('mousedown', handler, false);
  });
});
