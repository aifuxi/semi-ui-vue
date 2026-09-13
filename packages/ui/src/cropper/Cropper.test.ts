import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Cropper from './Cropper.vue';
import type { CropperMethods } from './types';

const IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"/%3E';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  callback: ResizeObserverCallback;
  disconnect = vi.fn();
  observe = vi.fn();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  unobserve() {}
}

function mockImageLoad(element: HTMLImageElement, width = 400, height = 200): void {
  Object.defineProperties(element, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height },
  });
}

describe('Cropper', () => {
  beforeEach(() => {
    ResizeObserverMock.instances = [];
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('semi-cropper') ? 400 : 0;
    });
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('semi-cropper') ? 200 : 0;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const width = this.classList.contains('semi-cropper') ? 400 : 100;
      const height = this.classList.contains('semi-cropper') ? 200 : 100;
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width,
        height,
        toJSON: () => ({}),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the pinned DOM and merges root and crop-box classes', () => {
    const wrapper = mount(Cropper, {
      attrs: { id: 'cropper', 'data-test': 'cropper' },
      props: {
        class: 'prop-class',
        className: 'legacy-class',
        cropperBoxClassName: 'box-class',
        shape: 'roundRect',
        src: IMAGE,
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-cropper', 'prop-class', 'legacy-class']),
    );
    expect(wrapper.attributes()).toMatchObject({ id: 'cropper', 'data-test': 'cropper' });
    expect(
      wrapper.find('.semi-cropper-img-wrapper > .semi-cropper-img').attributes(),
    ).toMatchObject({ crossorigin: 'anonymous', src: IMAGE });
    expect(wrapper.find('.semi-cropper-mask').exists()).toBe(true);
    expect(wrapper.find('.semi-cropper-box').classes()).toContain('box-class');
    expect(wrapper.find('.semi-cropper-view-box').classes()).toContain(
      'semi-cropper-view-box-round',
    );
  });

  it.each([
    ['omitted', {}, 8],
    ['explicit false', { showResizeBox: false }, 0],
    ['explicit true', { showResizeBox: true }, 8],
  ] as const)('honors showResizeBox when %s', async (_label, props, expected) => {
    const wrapper = mount(Cropper, { props: { src: IMAGE, ...props } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');
    expect(wrapper.findAll('.semi-cropper-box-corner')).toHaveLength(expected);
  });

  it('initializes image and crop box geometry and uses four handles for round shape', async () => {
    const wrapper = mount(Cropper, {
      props: { aspectRatio: 2, shape: 'round', src: IMAGE },
    });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    expect(image.style.width).toBe('400px');
    expect(image.style.height).toBe('200px');
    expect(wrapper.find('.semi-cropper-box').attributes('style')).toContain('width: 400px');
    expect(wrapper.find('.semi-cropper-box').attributes('style')).toContain('height: 200px');
    expect(wrapper.findAll('.semi-cropper-box-corner')).toHaveLength(4);
    expect(wrapper.find('.semi-cropper-box').classes()).toContain('semi-cropper-view-box-round');
  });

  it('prevents wheel default, updates zoom, and emits callback before v-model update', async () => {
    const wrapper = mount(Cropper, { props: { rotate: 0, src: IMAGE, zoom: 1 } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    const event = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      clientX: 200,
      clientY: 100,
      deltaY: -1,
    });
    wrapper.element.dispatchEvent(event);
    await wrapper.vm.$nextTick();

    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('zoomChange')).toEqual([[1.1]]);
    expect(wrapper.emitted('update:zoom')).toEqual([[1.1]]);
    expect(image.style.width).toBe('440.00000000000006px');
  });

  it('does not emit zoom beyond the configured boundary', async () => {
    const wrapper = mount(Cropper, {
      props: { maxZoom: 1, rotate: 0, src: IMAGE, zoom: 1 },
    });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');
    wrapper.element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }));
    expect(wrapper.emitted('zoomChange')).toBeUndefined();
  });

  it('syncs controlled rotate and zoom with the pinned transform order', async () => {
    const wrapper = mount(Cropper, { props: { rotate: 0, src: IMAGE, zoom: 1 } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');
    await wrapper.setProps({ rotate: 90, zoom: 2 });

    expect(image.style.width).toBe('800px');
    expect(image.style.height).toBe('400px');
    expect(image.style.transform).toContain('rotate(90deg)');
    expect(wrapper.find('.semi-cropper-view-img').attributes('style')).toContain('rotate(90deg)');
  });

  it('moves the crop box and resizes it from a corner through document events', async () => {
    const wrapper = mount(Cropper, { props: { src: IMAGE } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    const box = wrapper.find('.semi-cropper-box');
    await box.trigger('mousedown', { clientX: 150, clientY: 100 });
    document.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 170, clientY: 100 }),
    );
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(box.attributes('style')).toContain('translate(120px, 0px)');

    await wrapper.find('.semi-cropper-box-corner-br').trigger('mousedown');
    document.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 350, clientY: 180 }),
    );
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(box.attributes('style')).toContain('width: 230px');
    expect(box.attributes('style')).toContain('height: 180px');
  });

  it('applies initial controlled rotate and zoom when the image becomes loaded', async () => {
    const wrapper = mount(Cropper, { props: { rotate: 90, src: IMAGE, zoom: 2 } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    expect(image.style.width).toBe('800px');
    expect(image.style.height).toBe('400px');
    expect(image.style.transform).toContain('rotate(90deg)');
  });

  it('creates and removes a live preview image', async () => {
    const preview = document.createElement('div');
    document.body.appendChild(preview);
    const wrapper = mount(Cropper, { props: { preview: () => preview, src: IMAGE } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    expect(preview.querySelectorAll('img')).toHaveLength(1);
    expect(preview.style.overflow).toBe('hidden');
    expect((preview.querySelector('img') as HTMLImageElement).style.width).toBe('200px');
    wrapper.unmount();
    expect(preview.querySelectorAll('img')).toHaveLength(0);
    preview.remove();
  });

  it('exposes getCropperCanvas and paints the configured fill', async () => {
    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(400 * 200 * 4) })),
      putImageData: vi.fn(),
      rotate: vi.fn(),
      translate: vi.fn(),
      fillStyle: '',
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    const wrapper = mount(Cropper, { props: { fill: '#fff', src: IMAGE } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');

    const canvas = (wrapper.vm as unknown as CropperMethods).getCropperCanvas();
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.putImageData).toHaveBeenCalled();
    expect(context.fillStyle).toBe('#fff');
  });

  it('disconnects ResizeObserver and removes document drag listeners on unmount', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(Cropper, { props: { src: IMAGE } });
    const image = wrapper.find('.semi-cropper-img').element as HTMLImageElement;
    mockImageLoad(image);
    await wrapper.find('.semi-cropper-img').trigger('load');
    await wrapper.find('.semi-cropper-mask').trigger('mousedown', { clientX: 10, clientY: 10 });
    wrapper.unmount();

    expect(ResizeObserverMock.instances[0]?.disconnect).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
  });
});
