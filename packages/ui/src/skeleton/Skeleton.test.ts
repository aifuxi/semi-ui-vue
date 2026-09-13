import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import Skeleton from './Skeleton.vue';
import SkeletonAvatar from './SkeletonAvatar.vue';
import SkeletonButton from './SkeletonButton.vue';
import SkeletonImage from './SkeletonImage.vue';
import SkeletonParagraph from './SkeletonParagraph.vue';
import SkeletonTitle from './SkeletonTitle.vue';

describe('Skeleton', () => {
  it('区分 loading 缺省、显式 false 与显式 true', () => {
    for (const loading of [undefined, true] as const) {
      const wrapper = mount(Skeleton, {
        props: loading === undefined ? {} : { loading },
        slots: {
          default: '<strong class="content">content</strong>',
          placeholder: '<span class="placeholder">loading</span>',
        },
      });
      expect(wrapper.get('.semi-skeleton').attributes('x-semi-prop')).toBe('placeholder');
      expect(wrapper.get('.placeholder').text()).toBe('loading');
      expect(wrapper.find('.content').exists()).toBe(false);
    }

    const content = mount(Skeleton, {
      props: { loading: false },
      slots: {
        default: '<strong class="content">content</strong>',
        placeholder: '<span class="placeholder">loading</span>',
      },
    });
    expect(content.find('.semi-skeleton').exists()).toBe(false);
    expect(content.get('.content').text()).toBe('content');
    expect(content.find('.placeholder').exists()).toBe(false);
  });

  it('slot placeholder 优先于 VNode prop，并合并 active/class/style/attrs', () => {
    const wrapper = mount(Skeleton, {
      attrs: { 'aria-label': '加载用户信息', class: 'native-class', 'data-testid': 'skeleton' },
      props: {
        active: true,
        className: 'compat-class',
        placeholder: h('span', { class: 'prop-placeholder' }, 'prop'),
        style: { width: '240px' },
      },
      slots: { placeholder: '<span class="slot-placeholder">slot</span>' },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-skeleton',
        'semi-skeleton-active',
        'native-class',
        'compat-class',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '加载用户信息',
      'data-testid': 'skeleton',
      'x-semi-prop': 'placeholder',
    });
    expect(wrapper.attributes('style')).toContain('width: 240px');
    expect(wrapper.get('.slot-placeholder').text()).toBe('slot');
    expect(wrapper.find('.prop-placeholder').exists()).toBe(false);
  });

  it('placeholder prop 可承载 VNode，内容态不把根 attrs 克隆到子内容', () => {
    const loading = mount(Skeleton, {
      props: { placeholder: h('em', { class: 'prop-placeholder' }, 'wait') },
    });
    expect(loading.get('.prop-placeholder').text()).toBe('wait');

    const content = mount(Skeleton, {
      attrs: { class: 'should-not-clone', 'data-testid': 'wrapper-only' },
      props: { loading: false },
      slots: { default: '<article class="content">done</article>' },
    });
    expect(content.get('.content').classes()).not.toContain('should-not-clone');
    expect(content.get('.content').attributes('data-testid')).toBeUndefined();
  });
});

describe('Skeleton items', () => {
  it('渲染 Avatar 默认尺寸/形状、全部尺寸和 square', () => {
    const avatar = mount(SkeletonAvatar, {
      attrs: { 'data-testid': 'avatar' },
      props: { className: 'custom-avatar' },
    });
    expect(avatar.classes()).toEqual(
      expect.arrayContaining([
        'semi-skeleton-avatar',
        'semi-skeleton-avatar-medium',
        'semi-skeleton-avatar-circle',
        'custom-avatar',
      ]),
    );
    expect(avatar.attributes('data-testid')).toBe('avatar');

    for (const size of [
      'extra-extra-small',
      'extra-small',
      'small',
      'default',
      'medium',
      'large',
      'extra-large',
    ] as const) {
      expect(mount(SkeletonAvatar, { props: { size } }).classes()).toContain(
        `semi-skeleton-avatar-${size}`,
      );
    }
    expect(mount(SkeletonAvatar, { props: { shape: 'square' } }).classes()).toContain(
      'semi-skeleton-avatar-square',
    );
  });

  it('渲染 Image/Title/Button 并支持 prefixCls 与 attrs', () => {
    expect(mount(SkeletonImage).classes()).toContain('semi-skeleton-image');
    expect(mount(SkeletonTitle).classes()).toContain('semi-skeleton-title');
    expect(mount(SkeletonButton).classes()).toContain('semi-skeleton-button');
    const custom = mount(SkeletonTitle, {
      attrs: { id: 'custom-title' },
      props: { className: 'extra', prefixCls: 'custom-skeleton' },
    });
    expect(custom.classes()).toEqual(expect.arrayContaining(['custom-skeleton-title', 'extra']));
    expect(custom.attributes('id')).toBe('custom-title');
  });

  it('Paragraph 默认四行、自定义行数，且不透传其余 attrs', () => {
    const paragraph = mount(SkeletonParagraph, {
      attrs: { 'data-ignored': 'true' },
      props: { className: 'custom-paragraph' },
    });
    expect(paragraph.classes()).toEqual(
      expect.arrayContaining(['semi-skeleton-paragraph', 'custom-paragraph']),
    );
    expect(paragraph.findAll('li')).toHaveLength(4);
    expect(paragraph.attributes('data-ignored')).toBeUndefined();

    const compact = mount(SkeletonParagraph, { props: { rows: 1 } });
    expect(compact.findAll('li')).toHaveLength(1);
  });
});
