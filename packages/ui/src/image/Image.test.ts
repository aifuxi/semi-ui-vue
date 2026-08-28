import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Image, { ImagePreview } from './index';

const PIXEL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect width="80" height="60" fill="%230066ff"/%3E%3C/svg%3E';
const PIXEL_TWO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect width="80" height="60" fill="%2300aa66"/%3E%3C/svg%3E';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.removeAttribute('style');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Image', () => {
  it('按固定顺序处理 loading、load、src 重置和 error/fallback', async () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const wrapper = mount(Image, {
      props: { fallback: '/fallback.png', height: 60, onError, onLoad, src: PIXEL, width: 80 },
    });

    expect(wrapper.find('.semi-skeleton-image').exists()).toBe(true);
    await wrapper.get('img.semi-image-img').trigger('load');
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.semi-image-overlay').exists()).toBe(false);

    await wrapper.setProps({ src: '/broken.png' });
    expect(wrapper.find('.semi-skeleton-image').exists()).toBe(true);
    await wrapper.get('img.semi-image-img').trigger('error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(wrapper.get('.semi-image-status img').attributes()).toMatchObject({
      alt: 'fallback',
      src: '/fallback.png',
    });
    expect(wrapper.get('img.semi-image-img').classes()).toContain('semi-image-img-error');
  });

  it('支持 placeholder/fallback slots、img/root class/style 与原生 img attrs', () => {
    const wrapper = mount(Image, {
      attrs: { 'aria-label': '示例图片', class: 'root-attr', decoding: 'async' },
      props: {
        className: 'root-prop',
        height: 60,
        imgCls: 'inner-image',
        imgStyle: { objectFit: 'cover' },
        src: PIXEL,
        style: { border: '1px solid red' },
        width: 80,
      },
      slots: { placeholder: '<span class="loading-slot">加载</span>' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-image', 'root-attr', 'root-prop']),
    );
    expect(wrapper.attributes('style')).toContain('width: 80px');
    const image = wrapper.get('img');
    expect(image.classes()).toContain('inner-image');
    expect(image.attributes()).toMatchObject({ 'aria-label': '示例图片', decoding: 'async' });
    expect(image.attributes('style')).toContain('object-fit: cover');
    expect(wrapper.get('.loading-slot').text()).toBe('加载');
  });

  it('区分 preview 缺省、显式 false 与显式 true', async () => {
    const omitted = mount(Image, { attachTo: document.body, props: { src: PIXEL } });
    const disabled = mount(Image, {
      attachTo: document.body,
      props: { preview: false, src: PIXEL },
    });
    const enabled = mount(Image, {
      attachTo: document.body,
      props: { preview: true, src: PIXEL },
    });
    for (const wrapper of [omitted, disabled, enabled]) {
      await wrapper.get('img').trigger('load');
    }

    expect(omitted.get('img').classes()).toContain('semi-image-img-preview');
    expect(disabled.get('img').classes()).not.toContain('semi-image-img-preview');
    expect(enabled.get('img').classes()).toContain('semi-image-img-preview');
    await disabled.trigger('click');
    expect(document.querySelector('.semi-image-preview')).toBeNull();
    await enabled.trigger('click');
    await nextTick();
    expect(document.querySelector('.semi-image-preview')).not.toBeNull();

    omitted.unmount();
    disabled.unmount();
    enabled.unmount();
  });

  it('preview.visible 受控时只通知，不自行关闭', async () => {
    const onVisibleChange = vi.fn();
    const wrapper = mount(Image, {
      attachTo: document.body,
      props: { preview: { onVisibleChange, visible: true }, src: PIXEL },
    });
    await wrapper.get('img').trigger('load');
    await nextTick();
    expect(document.querySelector('.semi-image-preview')).not.toBeNull();
    document
      .querySelector<HTMLElement>('.semi-image-preview-header-close')
      ?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await nextTick();
    expect(onVisibleChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('.semi-image-preview')).not.toBeNull();
    wrapper.unmount();
  });
});

describe('ImagePreview', () => {
  it('递归收集 group Image，按点击索引打开并切换图片', async () => {
    const onChange = vi.fn();
    const wrapper = mount(ImagePreview, {
      attachTo: document.body,
      props: { lazyLoad: false, onChange },
      slots: {
        default: () =>
          h('div', [
            h(Image, { preview: { previewTitle: '第一张' }, src: PIXEL }),
            h(Image, { preview: { previewTitle: '第二张' }, src: PIXEL_TWO }),
          ]),
      },
    });
    const images = wrapper.findAll('img.semi-image-img');
    await images[0]!.trigger('load');
    await images[1]!.trigger('load');
    await images[1]!.trigger('click');
    await nextTick();

    expect(onChange).toHaveBeenCalledWith(1);
    expect(document.querySelector('.semi-image-preview-header-title')?.textContent).toBe('第二张');
    expect(document.querySelector('.semi-image-preview-footer-page')?.textContent).toBe('2/2');
    expect(document.querySelector<HTMLImageElement>('.semi-image-preview-image-img')?.src).toBe(
      PIXEL_TWO,
    );

    document.querySelector<HTMLElement>('.semi-image-preview-prev')?.click();
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(document.querySelector('.semi-image-preview-footer-page')?.textContent).toBe('1/2');
    wrapper.unmount();
  });

  it('真实模板与 h() 子 VNode 都区分裸 preview 和显式 false', async () => {
    const TemplateHost = defineComponent({
      components: { Image, ImagePreview },
      setup: () => ({ one: PIXEL, two: PIXEL_TWO }),
      template: `
        <ImagePreview :lazy-load="false">
          <Image :src="one" preview />
          <Image :src="two" :preview="false" />
        </ImagePreview>
      `,
    });
    const template = mount(TemplateHost);
    const render = mount(ImagePreview, {
      props: { lazyLoad: false },
      slots: {
        default: () => [
          h(Image, { preview: true, src: PIXEL }),
          h(Image, { preview: false, src: PIXEL_TWO }),
        ],
      },
    });

    for (const host of [template, render]) {
      const images = host.findAll('img.semi-image-img');
      await images[0]!.trigger('load');
      await images[1]!.trigger('load');
      expect(images[0]!.classes()).toContain('semi-image-img-preview');
      expect(images[1]!.classes()).not.toContain('semi-image-img-preview');
    }
  });

  it('支持受控 visible/currentIndex、Escape 事件顺序和 body scroll 恢复', async () => {
    const calls: string[] = [];
    const wrapper = mount(ImagePreview, {
      attachTo: document.body,
      props: {
        currentIndex: 1,
        lazyLoad: false,
        onClose: () => calls.push('close'),
        onVisibleChange: (visible) => calls.push(`visible:${visible}`),
        src: [PIXEL, PIXEL_TWO],
        visible: true,
      },
    });
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('.semi-image-preview-footer-page')?.textContent).toBe('2/2');

    const escapeEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' });
    Object.defineProperty(escapeEvent, 'keyCode', { value: 27 });
    window.dispatchEvent(escapeEvent);
    await nextTick();
    expect(calls).toEqual(['visible:false', 'close']);
    expect(document.querySelector('.semi-image-preview')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('.semi-image-preview')).toBeNull();
    wrapper.unmount();
  });

  it('受控 false 不被 defaultVisible 覆盖，非受控 defaultVisible 可打开', async () => {
    const controlled = mount(ImagePreview, {
      attachTo: document.body,
      props: { defaultVisible: true, src: PIXEL, visible: false },
    });
    expect(document.querySelector('.semi-image-preview')).toBeNull();
    controlled.unmount();

    const uncontrolled = mount(ImagePreview, {
      attachTo: document.body,
      props: { defaultCurrentIndex: 1, defaultVisible: true, src: [PIXEL, PIXEL_TWO] },
    });
    await nextTick();
    expect(document.querySelector('.semi-image-preview-footer-page')?.textContent).toBe('2/2');
    uncontrolled.unmount();
  });

  it('lazyLoad 使用 group root/margin 并在命中与卸载时清理 observer', async () => {
    let callback: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    const observer = vi.fn(function MockObserver(
      this: IntersectionObserver,
      nextCallback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      callback = nextCallback;
      Object.assign(this, {
        disconnect,
        observe,
        root: options?.root,
        rootMargin: options?.rootMargin,
        unobserve,
      });
    });
    vi.stubGlobal('IntersectionObserver', observer);
    const wrapper = mount(ImagePreview, {
      props: { lazyLoadMargin: '10px' },
      slots: { default: () => h(Image, { src: PIXEL }) },
    });
    await nextTick();
    await nextTick();
    const image = wrapper.get('img').element;
    expect(observer).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(image);
    expect(image.getAttribute('src')).toBeNull();
    callback?.(
      [{ isIntersecting: true, target: image } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(image.getAttribute('src')).toBe(PIXEL);
    expect(image.hasAttribute('data-src')).toBe(false);
    expect(unobserve).toHaveBeenCalledWith(image);
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('首次可见时直接挂载到稳定自定义容器且不锁 body', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const wrapper = mount(ImagePreview, {
      attachTo: document.body,
      props: { getPopupContainer: () => target, src: PIXEL, visible: true },
    });
    await nextTick();
    expect(target.querySelector('.semi-portal .semi-image-preview')).not.toBeNull();
    expect(document.body.style.overflow).toBe('');
    wrapper.unmount();
  });

  it('maskClosable、缩放、比例、旋转与 disableDownload 保持公开行为', async () => {
    const onVisibleChange = vi.fn();
    const onZoomIn = vi.fn();
    const onRatioChange = vi.fn();
    const onRotateLeft = vi.fn();
    const wrapper = mount(ImagePreview, {
      attachTo: document.body,
      props: {
        disableDownload: true,
        maskClosable: false,
        onRatioChange,
        onRotateLeft,
        onVisibleChange,
        onZoomIn,
        src: PIXEL,
        visible: true,
      },
    });
    await nextTick();
    const preview = document.querySelector<HTMLElement>('.semi-image-preview')!;
    preview.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 }));
    preview.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 10 }));
    expect(onVisibleChange).not.toHaveBeenCalled();

    document.querySelector<HTMLElement>('.semi-icon-plus')?.click();
    document.querySelector<HTMLElement>('.semi-icon-real_size_stroked')?.click();
    document.querySelector<HTMLElement>('.semi-icon-rotate')?.click();
    expect(onZoomIn).toHaveBeenCalled();
    expect(onRatioChange).toHaveBeenCalledWith('realSize');
    expect(onRotateLeft).toHaveBeenCalledWith(-90);
    expect(document.querySelector('.semi-icon-download')?.classList).toContain(
      'semi-image-preview-footer-disabled',
    );
    wrapper.unmount();
  });
});
