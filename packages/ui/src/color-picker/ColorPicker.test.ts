import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { InputNumber } from '../input-number';
import { ColorPicker, colorStringToValue } from './index';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete (window as Window & { EyeDropper?: unknown }).EyeDropper;
});

describe('ColorPicker', () => {
  it('keeps omitted, explicit false and template-bare true Boolean semantics', () => {
    const Host = defineComponent({
      components: { ColorPicker },
      template: `
        <div>
          <ColorPicker data-kind="omitted" />
          <ColorPicker data-kind="false" :alpha="false" :eye-dropper="false" />
          <ColorPicker data-kind="true" alpha eye-dropper />
        </div>
      `,
    });
    const wrapper = mount(Host);
    const pickers = wrapper.findAllComponents(ColorPicker);
    expect(pickers.map((picker) => picker.find('.semi-colorPicker-alphaSlider').exists())).toEqual([
      true,
      false,
      true,
    ]);
    expect(pickers.map((picker) => picker.find('.semi-icon-eyedropper').exists())).toEqual([
      true,
      false,
      true,
    ]);
  });

  it('renders the fixed DOM, dimensions, classes, slots and aria text', () => {
    const wrapper = mount(ColorPicker, {
      attrs: { 'data-kind': 'picker' },
      props: { className: 'custom-picker', width: 240, height: 160 },
      slots: {
        top: '<div class="top-slot">Top</div>',
        bottom: '<div class="bottom-slot">Bottom</div>',
      },
    });
    const root = wrapper.get('.semi-colorPicker');
    expect(root.classes()).toContain('custom-picker');
    expect(root.find('.top-slot').text()).toBe('Top');
    expect(root.find('.bottom-slot').text()).toBe('Bottom');
    expect(root.get('.semi-colorPicker-colorChooseArea').attributes()).toMatchObject({
      'aria-label': 'Color',
      'aria-valuetext': 'Saturation 71%, Brightness 77%',
    });
    expect(root.get('.semi-colorPicker-colorChooseArea').attributes('style')).toContain(
      'width: 240px',
    );
    expect(root.get('.semi-colorPicker-colorChooseArea').attributes('style')).toContain(
      'height: 160px',
    );
    expect(root.get('.semi-colorPicker-alphaSlider').attributes()).toMatchObject({
      'aria-label': 'Alpha',
      'aria-valuetext': '100%',
    });
  });

  it('converts supported color strings and rejects invalid input', () => {
    expect(ColorPicker.colorStringToValue('#ff000080')).toMatchObject({
      hex: '#ff000080',
      hsva: { h: 0, s: 100, v: 100 },
      rgba: { r: 255, g: 0, b: 0 },
    });
    expect(colorStringToValue('rgb(0, 255, 0)')).toMatchObject({
      hex: '#00ff00',
      hsva: { h: 120, s: 100, v: 100, a: 1 },
    });
    expect(colorStringToValue('rgba(0, 0, 255, 0.5)')).toMatchObject({
      hex: '#0000ff80',
      rgba: { b: 255, a: 0.5 },
    });
    expect(colorStringToValue('hsva(180, 50%, 50%, 0.25)')).toMatchObject({
      hsva: { h: 180, s: 50, v: 50, a: 0.25 },
    });
    expect(() => colorStringToValue('blue')).toThrow('Semi ColorPicker');
  });

  it('emits change and update events in order and updates uncontrolled hue', async () => {
    const order: string[] = [];
    const wrapper = mount(ColorPicker, {
      props: {
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('model'),
        'onUpdate:value': () => order.push('value'),
      },
    });
    const slider = wrapper.get('.semi-colorPicker-colorSlider');
    vi.spyOn(slider.element, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 280,
      bottom: 10,
      width: 280,
      height: 10,
      toJSON: () => ({}),
    });
    await slider.trigger('mousedown', { clientX: 140, clientY: 5 });
    await nextTick();
    expect(order).toEqual(['change', 'model', 'value']);
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ hsva: { h: 180 } });
    expect(wrapper.get('.semi-colorPicker-colorChooseArea').attributes('style')).toContain(
      'rgb(0, 255, 255)',
    );
    window.dispatchEvent(new MouseEvent('mouseup'));
  });

  it('keeps a controlled value authoritative while still notifying changes', async () => {
    const controlled = colorStringToValue('#ff0000');
    const wrapper = mount(ColorPicker, { props: { modelValue: controlled } });
    const slider = wrapper.get('.semi-colorPicker-colorSlider');
    vi.spyOn(slider.element, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 280,
      bottom: 10,
      width: 280,
      height: 10,
      toJSON: () => ({}),
    });
    await slider.trigger('mousedown', { clientX: 140, clientY: 5 });
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ hsva: { h: 180 } });
    expect(wrapper.get('.semi-colorPicker-colorChooseArea').attributes('style')).toContain(
      'rgb(255, 0, 0)',
    );
    window.dispatchEvent(new MouseEvent('mouseup'));
  });

  it('accepts hex input without a hash and validates hsva ranges', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultFormat: 'hex' } });
    const input = wrapper.get('.semi-colorPicker-colorPickerInput input');
    await input.setValue('00ff00');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ hex: '#00ff00' });
    const before = wrapper.emitted('change')?.length;
    await wrapper.setProps({ defaultFormat: 'hsva' });
    await input.setValue('400,100,100');
    expect(wrapper.emitted('change')).toHaveLength(before ?? 0);
    await input.setValue('120,100,100,0.5');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({
      hsva: { h: 120, s: 100, v: 100, a: 0.5 },
    });
  });

  it('updates alpha through the public InputNumber event', async () => {
    const wrapper = mount(ColorPicker, { props: { alpha: true, defaultFormat: 'rgba' } });
    wrapper.findComponent(InputNumber).vm.$emit('numberChange', 50);
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ rgba: { a: 0.5 } });
  });

  it('uses EyeDropper when available and silently ignores cancellation', async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: '#123456' });
    (window as Window & { EyeDropper?: unknown }).EyeDropper = class {
      open = open;
    };
    const wrapper = mount(ColorPicker);
    await wrapper.get('.semi-button').trigger('click');
    await flushPromises();
    expect(open).toHaveBeenCalledOnce();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ hex: '#123456' });

    open.mockRejectedValueOnce(new Error('cancelled'));
    await wrapper.get('.semi-button').trigger('click');
    await flushPromises();
  });

  it('mounts Popover content in a stable custom container and supports a custom trigger', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: {
        usePopover: true,
        popoverProps: {
          trigger: 'custom',
          visible: true,
          motion: false,
          getPopupContainer: () => container,
        },
      },
      slots: { default: '<button class="custom-trigger">Choose</button>' },
    });
    expect(wrapper.find('.semi-colorPicker').exists()).toBe(false);
    expect(wrapper.get('.custom-trigger').text()).toBe('Choose');
    for (let index = 0; index < 3; index += 1) {
      await nextTick();
      await flushPromises();
    }
    expect(container.querySelector('.semi-colorPicker')).not.toBeNull();
  });

  it('removes drag listeners when the component unmounts', async () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const wrapper = mount(ColorPicker);
    const slider = wrapper.get('.semi-colorPicker-colorSlider');
    vi.spyOn(slider.element, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 280,
      bottom: 10,
      width: 280,
      height: 10,
      toJSON: () => ({}),
    });
    await slider.trigger('mousedown', { clientX: 40, clientY: 5 });
    expect(add).toHaveBeenCalledWith('mousemove', expect.any(Function));
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('mouseup', expect.any(Function));
  });
});
