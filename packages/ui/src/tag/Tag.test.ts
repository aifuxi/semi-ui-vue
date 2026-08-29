import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from '../popover';
import Tag, { SplitTagGroup, TagGroup } from './index';

describe('Tag', () => {
  it('覆盖默认 DOM、枚举 class、图标、Avatar 与 attrs', () => {
    const wrapper = mount(Tag, {
      attrs: { 'data-testid': 'tag' },
      props: {
        avatarShape: 'circle',
        avatarSrc: '/avatar.png',
        className: 'custom',
        color: 'blue',
        prefixIcon: h('i', { class: 'prefix' }),
        shape: 'circle',
        size: 'large',
        suffixIcon: h('i', { class: 'suffix' }),
        type: 'solid',
      },
      slots: { default: 'Alpha' },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-tag',
        'semi-tag-large',
        'semi-tag-circle',
        'semi-tag-solid',
        'semi-tag-blue-solid',
        'semi-tag-avatar-circle',
        'custom',
      ]),
    );
    expect(wrapper.attributes('data-testid')).toBe('tag');
    expect(wrapper.get('.semi-tag-prefix-icon .prefix').element).toBeInstanceOf(HTMLElement);
    expect(wrapper.get('.semi-tag-content-ellipsis').text()).toBe('Alpha');
    expect(wrapper.get('.semi-tag-suffix-icon .suffix').element).toBeInstanceOf(HTMLElement);
    expect(wrapper.get('.semi-avatar').classes()).toContain('semi-avatar-circle');
  });

  it('区分 visible 缺省、显式 false 与显式 true', async () => {
    const uncontrolled = mount(Tag, { props: { closable: true }, slots: { default: 'A' } });
    await uncontrolled.get('.semi-tag-close').trigger('click');
    expect(uncontrolled.classes()).toContain('semi-tag-invisible');
    expect(uncontrolled.emitted('update:visible')).toEqual([[false]]);

    const hidden = mount(Tag, { props: { visible: false }, slots: { default: 'B' } });
    expect(hidden.classes()).toContain('semi-tag-invisible');
    const controlled = mount(Tag, {
      props: { closable: true, visible: true },
      slots: { default: 'C' },
    });
    await controlled.get('.semi-tag-close').trigger('click');
    expect(controlled.classes()).not.toContain('semi-tag-invisible');
    expect(controlled.emitted('update:visible')).toEqual([[false]]);
  });

  it('按顺序处理关闭、preventDefault、点击与键盘', async () => {
    const order: string[] = [];
    const onClose = vi.fn((_content, event: MouseEvent) => {
      order.push('close');
      event.preventDefault();
    });
    const onClick = vi.fn(() => order.push('click'));
    const wrapper = mount(Tag, {
      props: { closable: true, onClick, onClose, tagKey: 'alpha' },
      slots: { default: 'Alpha' },
    });
    await wrapper.get('.semi-tag-close').trigger('click');
    expect(onClose).toHaveBeenCalledWith('Alpha', expect.any(MouseEvent), 'alpha');
    expect(order).toEqual(['close']);
    expect(wrapper.classes()).not.toContain('semi-tag-invisible');
    expect(wrapper.emitted('update:visible')).toBeUndefined();

    await wrapper.trigger('keydown', { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
    const keyEvent = wrapper.emitted<KeyboardEvent[]>('keydown')?.[0]?.[0];
    expect(keyEvent?.defaultPrevented).toBe(true);
  });

  it('只为可交互标签添加 button/focus/键盘语义', async () => {
    const plain = mount(Tag, { slots: { default: 'Plain' } });
    expect(plain.attributes('role')).toBeUndefined();
    expect(plain.attributes('tabindex')).toBeUndefined();
    expect(plain.attributes('aria-label')).toBe('Tag: Plain');

    const closable = mount(Tag, { props: { closable: true }, slots: { default: 'Close' } });
    expect(closable.attributes('role')).toBe('button');
    expect(closable.attributes('tabindex')).toBe('0');
    expect(closable.attributes('aria-label')).toBe('Closable Tag: Close');
    await closable.trigger('keydown', { key: 'Delete' });
    expect(closable.emitted('close')).toHaveLength(1);
    expect(closable.classes()).toContain('semi-tag-invisible');
  });
});

describe('TagGroup', () => {
  it('从数据渲染、继承尺寸/头像形状且不修改输入', () => {
    const tagList = [
      { content: 'A', color: 'blue' as const },
      { content: 'B', size: 'small' as const, avatarShape: 'square' as const },
    ];
    const snapshot = JSON.stringify(tagList);
    const wrapper = mount(TagGroup, {
      props: { avatarShape: 'circle', size: 'large', tagList },
    });
    const tags = wrapper.findAll('.semi-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0]!.classes()).toContain('semi-tag-large');
    expect(tags[1]!.classes()).toContain('semi-tag-small');
    expect(JSON.stringify(tagList)).toBe(snapshot);
  });

  it('折叠为 +N、保留 restCount 并配置 Popover', () => {
    const wrapper = mount(TagGroup, {
      props: {
        maxTagCount: 1,
        restCount: 7,
        showPopover: true,
        tagList: [{ content: 'A' }, { content: 'B' }, { content: 'C' }],
      },
    });
    expect(wrapper.text()).toContain('A+7');
    expect(wrapper.text()).not.toContain('B');
    const popover = wrapper.getComponent(Popover);
    expect(popover.props('position')).toBe('top');
    expect(popover.props('showArrow')).toBe(true);
    expect(popover.props('content')).toHaveLength(2);
  });

  it('custom 模式原样渲染字符串与 VNode', () => {
    const wrapper = mount(TagGroup, {
      props: { mode: 'custom', tagList: ['text', h('strong', { class: 'custom' }, 'node')] },
    });
    expect(wrapper.text()).toBe('textnode');
    expect(wrapper.get('.custom').text()).toBe('node');
  });

  it('先调用条目 close 再通知 group close', async () => {
    const order: string[] = [];
    const wrapper = mount(TagGroup, {
      props: {
        onTagClose: () => order.push('group'),
        tagList: [
          {
            closable: true,
            content: 'A',
            onClose: () => order.push('item'),
            tagKey: 'a',
          },
        ],
      },
    });
    await wrapper.get('.semi-tag-close').trigger('click');
    expect(order).toEqual(['item', 'group']);
  });
});

describe('SplitTagGroup', () => {
  it('模板宿主展开 Fragment 并跳过注释空白', () => {
    const host = mount(
      defineComponent({
        components: { SplitTagGroup, Tag },
        data: () => ({ items: ['A', 'B', 'C'] }),
        template: `
          <SplitTagGroup aria-label="connected">
            direct text
            <!-- ignored -->
            <template v-for="item in items" :key="item"><Tag>{{ item }}</Tag></template>
          </SplitTagGroup>
        `,
      }),
    );
    const group = host.get('.semi-tag-split');
    const tags = group.findAll('.semi-tag');
    expect(group.attributes('role')).toBe('group');
    expect(group.attributes('aria-label')).toBe('connected');
    expect(group.text()).toContain('direct text');
    expect(tags).toHaveLength(3);
    expect(tags[0]!.classes()).toContain('semi-tag-first');
    expect(tags[1]!.classes()).not.toContain('semi-tag-first');
    expect(tags[2]!.classes()).toContain('semi-tag-last');
  });

  it('h 宿主保留 class 并同步更新 first/last', async () => {
    const items = shallowRef(['A', 'B']);
    const host = mount(
      defineComponent(
        () => () =>
          h(SplitTagGroup, { className: 'group' }, () =>
            items.value.map((item) => h(Tag, { className: `tag-${item}`, key: item }, () => item)),
          ),
      ),
    );
    expect(host.get('.tag-A').classes()).toContain('semi-tag-first');
    expect(host.get('.tag-B').classes()).toContain('semi-tag-last');
    items.value = ['A'];
    await nextTick();
    expect(host.get('.tag-A').classes()).toEqual(
      expect.arrayContaining(['semi-tag-first', 'semi-tag-last']),
    );
  });
});
