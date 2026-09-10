import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, rs } from '@rstest/core';

import Sidebar from './Sidebar.vue';
import SidebarAnnotation from './SidebarAnnotation.vue';
import SidebarMCPConfigure from './SidebarMCPConfigure.vue';
import SidebarAnnotationContent from './SidebarAnnotationContent.vue';
import SidebarCodeContent from './SidebarCodeContent.vue';
import SidebarCodeItem from './SidebarCodeItem.vue';
import SidebarContainer from './SidebarContainer.vue';
import SidebarFileItem from './SidebarFileItem.vue';
import SidebarMCPConfigureContent from './SidebarMCPConfigureContent.vue';
import { Input } from '../input';

afterEach(() => {
  rs.restoreAllMocks();
  rs.useRealTimers();
});

describe('Sidebar', () => {
  for (const [name, Component] of [
    ['Annotation', SidebarAnnotation],
    ['MCPConfigure', SidebarMCPConfigure],
  ] as const) {
    it(`${name} preserves inherited container Boolean defaults and explicit overrides`, async () => {
      for (const value of [undefined, false, true]) {
        const onCancel = rs.fn();
        const wrapper = mount(Component, {
          props: {
            visible: true,
            onCancel,
            ...(value === undefined ? {} : { motion: value, resizable: value, showClose: value }),
          },
        });
        expect(wrapper.find('.semi-resizable-resizable').exists()).toBe(value !== false);
        expect(wrapper.find('.semi-sidebar-animation-content_show').exists()).toBe(value !== false);
        const close = wrapper.find('button[aria-label="close"]');
        expect(close.exists()).toBe(value !== false);
        if (close.exists()) {
          await close.trigger('click');
          expect(onCancel).toHaveBeenCalledOnce();
        }
        wrapper.unmount();
      }
    });
  }

  it('保留默认 true Boolean，并区分显式 false/true', async () => {
    const omitted = mount(SidebarContainer, {
      props: { visible: true, motion: false, title: 'Workspace' },
      slots: { default: 'Body' },
    });
    expect(omitted.find('.semi-resizable-resizable').exists()).toBe(true);
    expect(omitted.find('.semi-sidebar-container-header-closeBtn').exists()).toBe(true);

    const disabled = mount(SidebarContainer, {
      props: {
        visible: true,
        motion: false,
        resizable: false,
        showClose: false,
        title: 'Workspace',
      },
    });
    expect(disabled.find('.semi-resizable-resizable').exists()).toBe(false);
    expect(disabled.find('.semi-sidebar-container-header-closeBtn').exists()).toBe(false);

    const enabled = mount(SidebarContainer, {
      props: { visible: true, motion: true, resizable: true, showClose: true },
    });
    expect(enabled.find('.semi-sidebar-animation-content_show').exists()).toBe(true);
    expect(enabled.find('.semi-sidebar-container-header-closeBtn').exists()).toBe(true);
  });

  it('转发关闭、Escape、可见终态并在卸载后清理监听', async () => {
    const onCancel = rs.fn();
    const afterVisibleChange = rs.fn();
    const wrapper = mount(SidebarContainer, {
      props: {
        visible: true,
        motion: false,
        resizable: false,
        closeOnEsc: true,
        onCancel,
        afterVisibleChange,
      },
    });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(afterVisibleChange).toHaveBeenLastCalledWith(false);
    wrapper.unmount();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('按主视图选项和详情回退事件顺序工作', async () => {
    const onActiveOptionChange = rs.fn();
    const onBackWard = rs.fn();
    const wrapper = mount(Sidebar, {
      props: {
        visible: true,
        motion: false,
        resizable: false,
        showClose: false,
        activeKey: 'code',
        options: [{ key: 'code', icon: h('i', 'C'), name: 'Code' }],
        renderMainContent: (key) => h('strong', { 'data-key': key }, 'Preview'),
        onActiveOptionChange,
        onBackWard,
      },
    });
    await wrapper.get('.semi-sidebar-options-button').trigger('click');
    expect(onActiveOptionChange.mock.calls[0]?.[1]).toBe('code');
    expect(wrapper.get('.semi-sidebar-main-content strong').attributes('data-key')).toBe('code');

    await wrapper.setProps({
      mode: 'code',
      detailContent: { name: 'index.ts', content: 'const ready = true', language: 'ts' },
    });
    await wrapper.get('[aria-label="back"]').trigger('click');
    expect(onBackWard.mock.calls[0]?.[1]).toBe('main');
    expect(wrapper.find('.semi-sidebar-code-content').exists()).toBe(true);
  });

  it('主视图退出并重开时重新挂载有状态插槽内容', async () => {
    const Counter = defineComponent({
      setup() {
        const count = ref(0);
        return () => h('button', { onClick: () => count.value++ }, String(count.value));
      },
    });
    const wrapper = mount(Sidebar, {
      props: { visible: true, motion: false, resizable: false },
      slots: { 'main-content': () => h(Counter) },
    });
    for (let index = 0; index < 2; index++) {
      const button = wrapper.get('.semi-sidebar-main-content button');
      expect(button.text()).toBe('0');
      await button.trigger('click');
      expect(button.text()).toBe('1');
      await wrapper.setProps({ mode: 'code' });
      await wrapper.setProps({ mode: 'main' });
    }
    expect(wrapper.get('.semi-sidebar-main-content button').text()).toBe('0');
  });

  it('MCP 搜索、模式和受控启停均返回克隆数组', async () => {
    rs.useFakeTimers();
    const options = [
      { value: 'search', label: 'Search', desc: 'Web search', active: false },
      { value: 'mail', label: 'Mail', desc: 'Inbox', active: true },
    ];
    const onStatusChange = rs.fn();
    const onSearch = rs.fn();
    const wrapper = mount(SidebarMCPConfigureContent, {
      props: { options, customOptions: [], onStatusChange, onSearch },
    });
    wrapper.findComponent(Input).vm.$emit('input', {
      target: { value: 'web' },
    } as unknown as Event);
    rs.advanceTimersByTime(301);
    await nextTick();
    expect(onSearch).toHaveBeenCalledWith('web', false);
    expect(wrapper.findAll('.semi-sidebar-mcp-configure-content-item')).toHaveLength(1);
    await wrapper
      .get(
        '.semi-sidebar-mcp-configure-content-item .semi-sidebar-mcp-configure-content-item-button',
      )
      .trigger('click');
    expect(onStatusChange.mock.calls[0]?.[0]).not.toBe(options);
    expect(onStatusChange.mock.calls[0]?.[0][0].active).toBe(true);
    expect(options[0]?.active).toBe(false);
  });

  it('渲染文本/视频引用并保持自定义 item slot', async () => {
    const onClick = rs.fn();
    const open = rs.spyOn(window, 'open').mockImplementation(() => null);
    const info = [
      {
        header: 'Sources',
        key: 'sources',
        annotations: [
          { type: 'video' as const, title: 'Demo', duration: 65, url: 'https://example.com' },
          { type: 'text' as const, title: 'Guide', detail: 'Details' },
        ],
      },
    ];
    const wrapper = mount(SidebarAnnotationContent, {
      props: { info, activeKey: 'sources', onClick },
    });
    expect(wrapper.text()).toContain('01:05');
    await wrapper.get('.semi-sidebar-annotation-item-video').trigger('click');
    expect(open).toHaveBeenCalledWith('https://example.com', '_blank');
    expect(onClick.mock.calls[0]?.[1].title).toBe('Demo');

    const custom = mount(SidebarAnnotationContent, {
      props: { info, activeKey: 'sources' },
      slots: { item: ({ annotation }) => h('mark', annotation.title) },
    });
    expect(custom.findAll('mark')).toHaveLength(2);
  });

  it('CodeContent 保持受控展开并转发展开 payload，CodeItem 区分代码和 JSON', async () => {
    const codes = [
      { key: 'main', name: 'main.ts', content: 'const ready = true', language: 'typescript' },
    ];
    const wrapper = mount(SidebarCodeContent, { props: { activeKey: 'main', codes } });
    await wrapper.get('.semi-sidebar-collapse-header-expand-btn').trigger('click');
    expect(wrapper.emitted('expand')?.[0]?.slice(1)).toEqual([codes[0], 'code']);
    expect(wrapper.text()).toContain('ready');

    const json = shallowMount(SidebarCodeItem, {
      props: { isJson: true, content: '{"ready":true}' },
    });
    expect(json.findComponent({ name: 'JsonViewer' }).exists()).toBe(true);
  });

  it('FileItem 缺省可编辑并完整渲染工具栏，只读模式保留内容且不创建工具栏', async () => {
    const editable = mount(SidebarFileItem, {
      props: { content: '<p>Editable note</p>' },
      attachTo: document.body,
    });
    await flushPromises();
    await nextTick();
    expect(editable.find('.ProseMirror[contenteditable="true"]').exists()).toBe(true);
    expect(editable.findAll('.semi-sidebar-file-menu-bar-btn').length).toBeGreaterThan(15);
    editable.unmount();

    const readonly = mount(SidebarFileItem, {
      props: { editable: false, content: '<p>Read only note</p>' },
    });
    expect(readonly.find('.semi-sidebar-file-menu-bar').exists()).toBe(false);
    expect(readonly.text()).toContain('Read only note');
  });
});
