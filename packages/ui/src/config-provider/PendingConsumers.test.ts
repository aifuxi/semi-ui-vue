import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from './index';
import { DatePicker } from '../date-picker';
import { TimePicker } from '../time-picker';
import { Modal } from '../modal';

const timestamp = 1581599305265;
describe('ConfigProvider pending consumers', () => {
  for (const controlled of [false, true])
    for (const picker of ['date', 'time'] as const)
      it(`${picker} preserves the instant across provider timezone changes (controlled=${controlled})`, async () => {
        const wrapper = mount(ConfigProvider, {
          props: { timeZone: 'GMT+08:00' },
          slots: {
            default: () =>
              picker === 'date'
                ? h(DatePicker, {
                    type: 'dateTime',
                    [controlled ? 'value' : 'defaultValue']: timestamp,
                  })
                : h(TimePicker, { [controlled ? 'value' : 'defaultValue']: timestamp }),
          },
        });
        try {
          expect(wrapper.get('input').element.value).toContain('21:08:25');
          for (const [timeZone, time] of [
            ['GMT+00:00', '13:08:25'],
            ['GMT-11:00', '02:08:25'],
            ['GMT+14:00', '03:08:25'],
            ['GMT+08:00', '21:08:25'],
          ] as const) {
            await wrapper.setProps({ timeZone });
            expect(wrapper.get('input').element.value).toContain(time);
          }
          const component =
            picker === 'date' ? wrapper.getComponent(DatePicker) : wrapper.getComponent(TimePicker);
          expect(component.emitted('change')).toBeUndefined();
        } finally {
          wrapper.unmount();
        }
      });
  for (const picker of ['date', 'time'] as const)
    it(`${picker} gives a new controlled value precedence over simultaneous timezone changes`, async () => {
      const wrapper =
        picker === 'date'
          ? mount(DatePicker, {
              props: { type: 'dateTime', value: timestamp, timeZone: 'GMT+08:00' },
            })
          : mount(TimePicker, { props: { value: timestamp, timeZone: 'GMT+08:00' } });
      try {
        await wrapper.setProps({ value: timestamp + 3600000, timeZone: 'GMT+00:00' });
        expect(wrapper.get('input').element.value).toContain('14:08:25');
        await wrapper.setProps({ value: timestamp + 7200000 });
        expect(wrapper.get('input').element.value).toContain('15:08:25');
        expect(wrapper.emitted('change')).toBeUndefined();
      } finally {
        wrapper.unmount();
      }
    });
  it('clears each Modal enter class on its own animation end and restarts on reopen', async () => {
    const afterClose = vi.fn();
    const wrapper = mount(Modal, {
      attachTo: document.body,
      props: { visible: true, title: 'Dialog', motion: true, onAfterClose: afterClose },
    });
    try {
      await nextTick();
      await nextTick();
      const mask = document.querySelector('.semi-modal-mask')!;
      const content = document.querySelector('.semi-modal-content')!;
      mask.dispatchEvent(new Event('animationend', { bubbles: true }));
      await nextTick();
      expect(mask.classList.contains('semi-modal-mask-animate-show')).toBe(false);
      expect(content.classList.contains('semi-modal-content-animate-show')).toBe(true);
      content.dispatchEvent(new Event('animationend', { bubbles: true }));
      await nextTick();
      expect(content.classList.contains('semi-modal-content-animate-show')).toBe(false);
      expect(afterClose).not.toHaveBeenCalled();
      await wrapper.setProps({ visible: false });
      content.dispatchEvent(new Event('animationend', { bubbles: true }));
      await nextTick();
      expect(afterClose).toHaveBeenCalledTimes(1);
      await wrapper.setProps({ visible: true });
      await nextTick();
      expect(document.querySelector('.semi-modal-content-animate-show')).not.toBeNull();
    } finally {
      wrapper.unmount();
    }
  });
});
