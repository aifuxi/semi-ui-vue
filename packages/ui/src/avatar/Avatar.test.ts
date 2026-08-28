/* eslint-disable vue/one-component-per-file -- test hosts cover template and render VNode inputs. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Avatar, { AvatarGroup } from './index';

describe('Avatar', () => {
  it('渲染默认文本语义、全尺寸、自定义尺寸、形状与颜色', () => {
    const wrapper = mount(
      defineComponent({
        components: { Avatar },
        template: `
          <div>
            <Avatar>U</Avatar>
            <Avatar size="extra-extra-small" color="red">XS</Avatar>
            <Avatar size="6rem" shape="square" color="white">Custom</Avatar>
          </div>
        `,
      }),
    );
    const avatars = wrapper.findAll('.semi-avatar');
    expect(avatars[0]!.classes()).toEqual(
      expect.arrayContaining(['semi-avatar-circle', 'semi-avatar-medium', 'semi-avatar-grey']),
    );
    expect(avatars[0]!.get('[role="img"]').attributes('aria-label')).toBe('U');
    expect(avatars[1]!.classes()).toContain('semi-avatar-extra-extra-small');
    expect(avatars[2]!.classes()).toEqual(
      expect.arrayContaining(['semi-avatar-square', 'semi-avatar-6rem', 'semi-avatar-white']),
    );
    expect(avatars[2]!.attributes('style')).toContain('width: 6rem');
    expect(avatars[2]!.attributes('style')).toContain('height: 6rem');
  });

  it('根据文字宽度和 gap 缩放，并在动态内容变化后重算', async () => {
    const wrapper = mount(Avatar, { slots: { default: 'Semi' } });
    const root = wrapper.get('.semi-avatar').element;
    const content = wrapper.get('.semi-avatar-content').element;
    Object.defineProperty(root, 'offsetWidth', { configurable: true, value: 48 });
    Object.defineProperty(content, 'offsetWidth', { configurable: true, value: 80 });
    await wrapper.setProps({ gap: 4 });
    await nextTick();
    await nextTick();
    expect(wrapper.get('.semi-avatar-content').attributes('style')).toContain('scale(0.5)');
  });

  it('图片成功时使用 img class/attrs，失败后回退；返回 false 可保留图片', async () => {
    const onError = vi.fn();
    const wrapper = mount(Avatar, {
      props: {
        src: '/avatar.png',
        srcSet: '/avatar@2x.png 2x',
        alt: 'Alice',
        imgAttr: { decoding: 'async', draggable: false },
        onError,
      },
      slots: { default: 'AS' },
    });
    expect(wrapper.get('.semi-avatar').classes()).toContain('semi-avatar-img');
    expect(wrapper.get('img').attributes()).toMatchObject({
      alt: 'Alice',
      decoding: 'async',
      draggable: 'false',
      src: '/avatar.png',
      srcset: '/avatar@2x.png 2x',
    });
    await wrapper.get('img').trigger('error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get('.semi-avatar').classes()).toContain('semi-avatar-grey');

    const blocked = mount(Avatar, {
      props: { src: '/blocked.png', onError: () => false },
      slots: { default: 'B' },
    });
    await blocked.get('img').trigger('error');
    expect(blocked.find('img').exists()).toBe(true);
  });

  it('按固定 Adapter 顺序合并 imgAttr，并只在可点击时覆盖键盘焦点事件', async () => {
    const configuredError = vi.fn();
    const configuredFocus = vi.fn();
    const wrapper = mount(Avatar, {
      props: {
        src: '/avatar.png',
        alt: 'Component alt',
        imgAttr: {
          alt: 'imgAttr alt',
          src: '/img-attr.png',
          tabindex: 4,
          onError: configuredError,
          onFocus: configuredFocus,
        },
      },
      slots: { default: 'AS' },
    });
    expect(wrapper.get('img').attributes()).toMatchObject({
      alt: 'imgAttr alt',
      src: '/img-attr.png',
      tabindex: '4',
    });
    await wrapper.get('img').trigger('focus');
    await wrapper.get('img').trigger('error');
    expect(configuredFocus).toHaveBeenCalledTimes(1);
    expect(configuredError).toHaveBeenCalledTimes(1);
    expect(wrapper.find('img').exists()).toBe(true);

    const clickableFocus = vi.fn();
    const clickable = mount(Avatar, {
      props: {
        src: '/clickable.png',
        onClick: vi.fn(),
        imgAttr: { alt: 'override', tabindex: 4, onFocus: clickableFocus },
      },
    });
    expect(clickable.get('img').attributes()).toMatchObject({ alt: 'override', tabindex: '0' });
    await clickable.get('img').trigger('focus');
    expect(clickableFocus).not.toHaveBeenCalled();
  });

  it('可点击头像支持鼠标、Enter、Escape、focus-visible 与固定 alt 前缀', async () => {
    const click = vi.fn();
    const wrapper = mount(Avatar, {
      props: { alt: 'Alice', onClick: click },
      slots: { default: 'AS' },
      attachTo: document.body,
    });
    const label = wrapper.get('.semi-avatar-label');
    expect(label.attributes()).toMatchObject({
      'aria-label': 'clickable Avatar: Alice',
      tabindex: '0',
    });
    await wrapper.get('.semi-avatar').trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
    await label.trigger('keydown', { key: 'Enter' });
    expect(click).toHaveBeenCalledTimes(2);
    (label.element as HTMLElement).focus();
    await label.trigger('focus');
    expect(wrapper.get('.semi-avatar').classes()).toContain('semi-avatar-focus');
    await label.trigger('keydown', { key: 'Escape' });
    expect(document.activeElement).not.toBe(label.element);
    wrapper.unmount();
  });

  it('hover mask 先更新 DOM 后派发事件，leave 后清理', async () => {
    const enter = vi.fn(() => {
      expect(wrapper.find('.semi-avatar-hover').exists()).toBe(true);
    });
    const leave = vi.fn();
    const wrapper = mount(Avatar, {
      props: { onMouseenter: enter, onMouseleave: leave },
      slots: { default: 'A', hoverMask: '<span class="mask">camera</span>' },
    });
    await wrapper.get('.semi-avatar').trigger('mouseenter');
    await nextTick();
    expect(wrapper.find('.semi-avatar-hover .mask').exists()).toBe(true);
    expect(enter).toHaveBeenCalledTimes(1);
    await wrapper.get('.semi-avatar').trigger('mouseleave');
    await nextTick();
    expect(wrapper.find('.semi-avatar-hover').exists()).toBe(false);
    expect(leave).toHaveBeenCalledTimes(1);
  });

  it('渲染顶部/底部 slot、附加边框和动效，同时把样式与事件移到 wrapper', async () => {
    const click = vi.fn();
    const wrapper = mount(Avatar, {
      props: {
        border: { color: 'rgb(255, 0, 0)', motion: true },
        bottomSlot: { shape: 'circle', text: 'plus', bgColor: 'blue' },
        contentMotion: true,
        onClick: click,
        size: 'large',
        style: { margin: '4px' },
        topSlot: { text: 'LIVE', gradientStart: 'red', gradientEnd: 'pink' },
      },
      slots: { default: 'A' },
    });
    expect(wrapper.get('.semi-avatar-wrapper').attributes('style')).toContain('margin: 4px');
    expect(wrapper.get('.semi-avatar-wrapper > div').attributes('style')).toContain('margin: 4px');
    expect(wrapper.get('.semi-avatar').attributes('style')).toBeUndefined();
    expect(wrapper.findAll('.semi-avatar-additionalBorder')).toHaveLength(2);
    expect(wrapper.find('.semi-avatar-additionalBorder-animated').exists()).toBe(true);
    expect(wrapper.get('.semi-avatar-top_slot-content').text()).toBe('LIVE');
    expect(wrapper.get('.semi-avatar-bottom_slot').text()).toBe('plus');
    expect(wrapper.find('linearGradient').exists()).toBe(true);
    await wrapper.get('.semi-avatar-wrapper').trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('缺省、显式 false、显式 true 的 Boolean 装饰语义互不混淆', () => {
    const host = mount(
      defineComponent({
        components: { Avatar },
        template: `
          <div>
            <Avatar>A</Avatar>
            <Avatar :border="false" :content-motion="false">B</Avatar>
            <Avatar border content-motion>C</Avatar>
          </div>
        `,
      }),
    );
    expect(host.findAll('.semi-avatar-wrapper')).toHaveLength(1);
    expect(host.findAll('.semi-avatar-animated')).toHaveLength(1);
  });
});

describe('AvatarGroup', () => {
  it('模板子节点与 render function 子节点都被 Group 覆盖 size/shape 并保留 class', () => {
    const templateHost = mount(
      defineComponent({
        components: { Avatar, AvatarGroup },
        template: `
          <AvatarGroup size="small" shape="square">
            <Avatar class-name="original" size="large" shape="circle">A</Avatar>
            <Avatar>B</Avatar>
          </AvatarGroup>
        `,
      }),
    );
    const templateAvatars = templateHost.findAll('.semi-avatar');
    expect(templateAvatars).toHaveLength(2);
    expect(templateAvatars[0]!.classes()).toEqual(
      expect.arrayContaining([
        'original',
        'semi-avatar-small',
        'semi-avatar-square',
        'semi-avatar-item-start-0',
      ]),
    );

    const renderHost = mount(
      defineComponent({
        render: () =>
          h(AvatarGroup, { size: 'extra-small', overlapFrom: 'end' }, () => [
            h(Avatar, { color: 'red' }, () => 'A'),
            h(Avatar, { color: 'blue' }, () => 'B'),
          ]),
      }),
    );
    expect(renderHost.get('.semi-avatar-item-end-1').classes()).toContain(
      'semi-avatar-extra-small',
    );
  });

  it('Group 克隆时保留模板裸 Boolean 与 render function 显式 true/false', () => {
    const templateHost = mount(
      defineComponent({
        components: { Avatar, AvatarGroup },
        template: `
          <AvatarGroup>
            <Avatar>A</Avatar>
            <Avatar border>B</Avatar>
            <Avatar :border="false">C</Avatar>
          </AvatarGroup>
        `,
      }),
    );
    expect(templateHost.findAll('.semi-avatar-wrapper')).toHaveLength(1);

    const renderHost = mount(
      defineComponent({
        render: () =>
          h(AvatarGroup, null, () => [
            h(Avatar, { border: true }, () => 'A'),
            h(Avatar, { border: false }, () => 'B'),
          ]),
      }),
    );
    expect(renderHost.findAll('.semi-avatar-wrapper')).toHaveLength(1);
  });

  it('maxCount 生成 +N/剩余 alt，并支持 more scoped slot', () => {
    const wrapper = mount(
      defineComponent({
        components: { Avatar, AvatarGroup },
        template: `
          <AvatarGroup :max-count="2">
            <Avatar alt="Alice">A</Avatar>
            <Avatar>B</Avatar>
            <Avatar alt="Carol">C</Avatar>
            <Avatar>D</Avatar>
          </AvatarGroup>
        `,
      }),
    );
    expect(wrapper.findAll('.semi-avatar')).toHaveLength(3);
    const more = wrapper.get('.semi-avatar-item-more');
    expect(more.text()).toBe('+2');
    expect(more.get('[role="img"]').attributes('aria-label')).toContain(
      'Number of remaining Avatars：2,Carol,D',
    );

    const custom = mount(
      defineComponent({
        components: { Avatar, AvatarGroup },
        template: `
          <AvatarGroup :max-count="1">
            <Avatar>A</Avatar><Avatar>B</Avatar><Avatar>C</Avatar>
            <template #more="{ restNumber }"><span class="custom-more">/{{ restNumber }}</span></template>
          </AvatarGroup>
        `,
      }),
    );
    expect(custom.get('.custom-more').text()).toBe('/2');
  });

  it('按固定源码保留负数和小数 maxCount 的 restNumber 计算', () => {
    const renderGroup = (maxCount: number) =>
      mount(AvatarGroup, {
        props: { maxCount },
        slots: {
          default: () => [
            h(Avatar, null, () => 'A'),
            h(Avatar, null, () => 'B'),
            h(Avatar, null, () => 'C'),
          ],
        },
      });
    expect(renderGroup(-1).get('.semi-avatar-item-more').text()).toBe('+4');
    expect(renderGroup(1.5).get('.semi-avatar-item-more').text()).toBe('+1.5');
    expect(renderGroup(Number.NaN).find('.semi-avatar-item-more').exists()).toBe(false);
  });

  it('把 Group 其余 attrs 传给每个 Avatar 而不污染 role=list 根', () => {
    const wrapper = mount(AvatarGroup, {
      attrs: { 'data-member': 'team', style: 'opacity: 0.8' },
      slots: { default: () => [h(Avatar, null, () => 'A')] },
    });
    expect(wrapper.get('.semi-avatar-group').attributes('data-member')).toBeUndefined();
    expect(wrapper.get('.semi-avatar').attributes('data-member')).toBe('team');
    expect(wrapper.get('.semi-avatar').attributes('style')).toContain('opacity: 0.8');
  });
});
