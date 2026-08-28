import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, type VNodeChild } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Tree, { type TreeExposed, type TreeNodeData, type TreeSlots } from './index';

const data: TreeNodeData[] = [
  {
    key: 'asia',
    label: '亚洲',
    value: 'Asia',
    children: [
      {
        key: 'china',
        label: '中国',
        value: 'China',
        children: [
          { key: 'beijing', label: '北京', value: 'Beijing' },
          { key: 'shanghai', label: '上海', value: 'Shanghai', disabled: true },
        ],
      },
      { key: 'japan', label: '日本', value: 'Japan' },
    ],
  },
  { key: 'america', label: '北美洲', value: 'America' },
];

const wrappers: Array<ReturnType<typeof mount>> = [];
function mountTree(props: Record<string, unknown> = {}, slots: TreeSlots = {}) {
  const wrapper = mount(Tree, {
    attachTo: document.body,
    props: { treeData: data, ...props },
    slots: slots as unknown as Record<string, (...args: never[]) => VNodeChild>,
  });
  wrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('Tree', () => {
  it('保留根/list/node DOM、class、data、ARIA 与默认 true Boolean', () => {
    const wrapper = mountTree({
      ariaLabel: '地区树',
      className: 'custom-tree',
      defaultExpandAll: true,
      'data-owner': 'docs',
      style: { height: '320px' },
    });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-tree-wrapper', 'custom-tree']));
    expect(wrapper.attributes()).toMatchObject({ 'aria-label': '地区树', 'data-owner': 'docs' });
    expect((wrapper.element as HTMLElement).style.height).toBe('320px');
    expect(wrapper.get('[role="tree"]').classes()).toContain('semi-tree-option-list-block');
    const nodes = wrapper.findAll('[role="treeitem"]');
    expect(nodes).toHaveLength(6);
    expect(nodes[0]!.attributes()).toMatchObject({
      'aria-expanded': 'true',
      'aria-level': '1',
      'aria-selected': 'false',
      'data-key': 'asia',
    });
    expect(nodes[1]!.classes()).toContain('semi-tree-option-level-2');
  });

  it.each([
    [{}, true],
    [{ blockNode: false }, false],
    [{ blockNode: true }, true],
  ])('blockNode 缺省/false/true 三态：%j', (extra, expected) => {
    expect(
      mountTree(extra)
        .get('.semi-tree-option-list')
        .classes()
        .includes('semi-tree-option-list-block'),
    ).toBe(expected);
  });

  it.each([
    [{}, true],
    [{ showClear: false }, false],
    [{ showClear: true }, true],
  ])('showClear 缺省/false/true 三态：%j', (extra, expected) => {
    const wrapper = mountTree({ filterTreeNode: true, ...extra });
    expect(wrapper.getComponent({ name: 'Input' }).props('showClear')).toBe(expected);
  });

  it('非受控单选严格按 select/change/update 顺序，并且 disabled 不触发', async () => {
    const order: string[] = [];
    const wrapper = mountTree({
      defaultExpandAll: true,
      onSelect: (key: string) => order.push(`select:${key}`),
      onChange: (value: string) => order.push(`change:${value}`),
      'onUpdate:value': (value: string) => order.push(`value:${value}`),
      'onUpdate:modelValue': (value: string) => order.push(`model:${value}`),
    });
    await wrapper.get('[data-key="beijing"]').trigger('click');
    expect(order).toEqual(['select:beijing', 'change:Beijing', 'value:Beijing', 'model:Beijing']);
    expect(wrapper.get('[data-key="beijing"]').classes()).toContain('semi-tree-option-selected');
    await wrapper.get('[data-key="shanghai"]').trigger('click');
    expect(order).toHaveLength(4);
  });

  it('受控 value 不自行提交，父级回写后才改变选中项', async () => {
    const wrapper = mountTree({ defaultExpandAll: true, value: 'Beijing' });
    await wrapper.get('[data-key="japan"]').trigger('click');
    expect(wrapper.get('[data-key="beijing"]').classes()).toContain('semi-tree-option-selected');
    expect(wrapper.get('[data-key="japan"]').classes()).not.toContain('semi-tree-option-selected');
    await wrapper.setProps({ value: 'Japan' });
    expect(wrapper.get('[data-key="japan"]').classes()).toContain('semi-tree-option-selected');
  });

  it('展开按钮保留 expand/update 顺序，受控 expandedKeys 等待回写', async () => {
    const order: string[] = [];
    const wrapper = mountTree({
      expandedKeys: [],
      onExpand: (keys: string[]) => order.push(`expand:${keys.join(',')}`),
      'onUpdate:expandedKeys': (keys: string[]) => order.push(`update:${keys.join(',')}`),
    });
    await wrapper.get('[data-key="asia"] .semi-tree-option-expand-icon').trigger('click');
    expect(order).toEqual(['expand:asia', 'update:asia']);
    expect(wrapper.find('[data-key="china"]').exists()).toBe(false);
    await wrapper.setProps({ expandedKeys: ['asia'] });
    expect(wrapper.find('[data-key="china"]').exists()).toBe(true);
  });

  it('multiple related / unRelated 保留 checked、halfChecked 与 value 语义', async () => {
    const related = mountTree({ defaultExpandAll: true, multiple: true });
    await related.get('[data-key="beijing"] .semi-checkbox').trigger('click');
    expect(related.get('[data-key="beijing"] .semi-checkbox-inner').classes()).toContain(
      'semi-checkbox-inner-checked',
    );
    expect(related.get('[data-key="china"] .semi-checkbox').classes()).toContain(
      'semi-checkbox-indeterminate',
    );
    expect(related.emitted('change')?.at(-1)?.[0]).toEqual(['Beijing']);
    const unrelated = mountTree({
      checkRelation: 'unRelated',
      defaultExpandAll: true,
      multiple: true,
    });
    await unrelated.get('[data-key="china"] .semi-checkbox').trigger('click');
    expect(unrelated.emitted('change')?.at(-1)?.[0]).toEqual(['China']);
    expect(unrelated.get('[data-key="beijing"] .semi-checkbox-inner').classes()).not.toContain(
      'semi-checkbox-inner-checked',
    );
  });

  it('搜索、showFilteredOnly、自定义字段与公开 search 方法工作', async () => {
    const wrapper = mountTree({ filterTreeNode: true, showFilteredOnly: true });
    (wrapper.vm as unknown as TreeExposed).search('北京');
    await nextTick();
    expect(wrapper.findAll('[role="treeitem"]').map((node) => node.text())).toEqual([
      '亚洲',
      '中国',
      '北京',
    ]);
    expect(wrapper.get('.semi-tree-option-highlight').text()).toBe('北京');
    expect(wrapper.emitted('search')?.[0]).toEqual(['北京', ['china', 'asia']]);
    const custom = mountTree({
      filterTreeNode: true,
      keyMaps: { key: 'id', label: 'name', value: 'code', children: 'items' },
      treeData: [{ id: 'a', name: 'Alpha', code: 1, items: [{ id: 'b', name: 'Beta', code: 2 }] }],
    });
    (custom.vm as unknown as TreeExposed).search('Beta');
    await nextTick();
    expect(custom.text()).toContain('Beta');
  });

  it('scoped slots 覆盖 search/icon/expandIcon/label', () => {
    const wrapper = mountTree(
      { defaultExpandAll: true, filterTreeNode: true },
      {
        search: ({ value }: { value: string }) =>
          h('div', { class: 'custom-search' }, value || 'search'),
        icon: ({ node }: { node: TreeNodeData }) => h('i', { class: 'custom-icon' }, node.key),
        expandIcon: ({ expanded }: { expanded: boolean }) =>
          h('b', { class: 'custom-expand' }, String(expanded)),
        label: ({ label }: { label?: VNodeChild }) =>
          h('strong', { class: 'custom-label' }, String(label ?? '')),
      },
    );
    expect(wrapper.get('.custom-search').text()).toBe('search');
    expect(wrapper.findAll('.custom-icon').length).toBeGreaterThan(0);
    expect(wrapper.get('.custom-expand').text()).toBe('true');
    expect(wrapper.get('.custom-label').text()).toBe('亚洲');
  });

  it('fullLabel 插槽保留 class/事件，并在 draggable 时回挂 DOM 与拖拽契约', async () => {
    const wrapper = mountTree(
      { defaultExpandAll: true, draggable: true },
      {
        fullLabel: ({ className, data, onClick }) =>
          h(
            'article',
            { class: ['custom-full-label', className], 'data-custom-key': data.key, onClick },
            String(data.label),
          ),
      },
    );
    const asia = wrapper.get('[data-custom-key="asia"]');
    expect(asia.classes()).toContain('semi-tree-option-fullLabel-draggable');
    expect((asia.element as HTMLElement).draggable).toBe(true);
    await asia.trigger('click');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('Asia');
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn() };
    await asia.trigger('dragstart', { dataTransfer });
    expect(wrapper.emitted('dragStart')?.[0]?.[0]).toMatchObject({ node: { key: 'asia' } });
  });

  it('Enter 与 expandAction=click 保留选择/展开行为，directory/showLine/RTL 可渲染', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h('div', { class: 'semi-rtl' }, [
          h(Tree, { directory: true, expandAction: 'click', showLine: true, treeData: data }),
        ]),
    });
    const wrapper = mount(Host, { attachTo: document.body });
    wrappers.push(wrapper);
    const asia = wrapper.get('[data-key="asia"]');
    await asia.trigger('keypress', { key: 'Enter' });
    expect(wrapper.find('[data-key="china"]').exists()).toBe(true);
    expect(asia.classes()).toContain('semi-tree-option-selected');
    expect(wrapper.find('.semi-tree-option-item-icon').exists()).toBe(true);
    expect(wrapper.find('.semi-tree-option-indent-show-line').exists()).toBe(true);
  });

  it('展开收起以 200ms Collapsible 分组过渡，motion=false 立即更新', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['asia'] });
    await wrapper.get('[data-key="asia"] .semi-tree-option-expand-icon').trigger('click');
    await nextTick();
    const motion = wrapper.get('.semi-collapsible-wrapper');
    expect(motion.text()).toContain('中国');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect((motion.element as HTMLElement).style.transitionDuration).toBe('200ms');
    await motion.trigger('transitionend');
    expect(wrapper.find('[data-key="china"]').exists()).toBe(false);

    const immediate = mountTree({ defaultExpandedKeys: ['asia'], motion: false });
    await immediate.get('[data-key="asia"] .semi-tree-option-expand-icon').trigger('click');
    expect(immediate.find('.semi-collapsible-wrapper').exists()).toBe(false);
    expect(immediate.find('[data-key="china"]').exists()).toBe(false);
  });

  it('异步 loadData 按 expand/update/loadData/load 顺序完成', async () => {
    const order: string[] = [];
    const wrapper = mountTree({
      treeData: [{ key: 'lazy', label: 'Lazy', value: 'Lazy', isLeaf: false }],
      loadData: vi.fn(async () => {
        order.push('loadData');
      }),
      onExpand: () => order.push('expand'),
      'onUpdate:expandedKeys': () => order.push('update'),
      onLoad: () => order.push('load'),
    });
    await wrapper.get('.semi-tree-option-expand-icon').trigger('click');
    await nextTick();
    await Promise.resolve();
    expect(order).toEqual(['expand', 'update', 'loadData', 'load']);
  });

  it('虚拟列表裁剪并通过 scrollTo 定位节点', async () => {
    const many = Array.from({ length: 100 }, (_, index) => ({
      key: `k${index}`,
      label: `节点${index}`,
      value: index,
    }));
    const wrapper = mount(Tree, {
      attachTo: document.body,
      props: { treeData: many, virtualize: { height: 96, itemSize: 32, width: 240 } },
    });
    wrappers.push(wrapper);
    const list = wrapper.get('.semi-tree-virtual-list').element as HTMLElement;
    Object.defineProperty(list, 'clientHeight', { configurable: true, value: 96 });
    (wrapper.vm as unknown as TreeExposed).scrollTo({ key: 'k50', align: 'start' });
    await nextTick();
    expect(list.scrollTop).toBe(1600);
    expect(wrapper.findAll('[role="treeitem"]').length).toBeLessThan(20);
    expect(wrapper.text()).toContain('节点50');
  });

  it('拖拽输出 node/dragNode/dropPosition', async () => {
    const wrapper = mountTree({ defaultExpandAll: true, draggable: true });
    const source = wrapper.get('[data-key="asia"]');
    const target = wrapper.get('[data-key="america"]');
    const dataTransfer = { setData: vi.fn(), setDragImage: vi.fn() };
    await source.trigger('dragstart', { dataTransfer });
    vi.spyOn(target.element as HTMLElement, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 32,
      height: 32,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    await target.trigger('dragenter', { clientY: 16, dataTransfer });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await target.trigger('drop', { clientY: 16, dataTransfer });
    const detail = wrapper.emitted('drop')?.[0]?.[0] as {
      dragNode: TreeNodeData;
      node: TreeNodeData;
      dropToGap: boolean;
    };
    expect(detail.dragNode.key).toBe('asia');
    expect(detail.node.key).toBe('america');
    expect(detail.dropToGap).toBe(false);
  });
});
