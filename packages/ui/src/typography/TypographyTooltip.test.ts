import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, rs } from '@rstest/core';
import { Text } from './index';

beforeEach(() => {
  rs.useFakeTimers();
  // jsdom cannot measure ellipsis: force only the text's overflow branch. Geometry is tested in Chromium.
  rs.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(80);
  rs.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
});
afterEach(() => {
  rs.useRealTimers();
  rs.restoreAllMocks();
  document.body.replaceChildren();
});
async function settle() {
  for (let index = 0; index < 5; index++) {
    await nextTick();
    await rs.advanceTimersByTimeAsync(20);
  }
}

describe('Typography ellipsis popup contracts', () => {
  for (const showArrow of [undefined, false, true])
    it(`passes Popover options and rich content to the custom container (showArrow=${showArrow})`, async () => {
      const container = document.createElement('div');
      document.body.append(container);
      const wrapper = mount(Text, {
        attachTo: document.body,
        props: {
          ellipsis: {
            showTooltip: {
              type: 'popover',
              opts: {
                trigger: 'custom',
                visible: true,
                motion: false,
                getPopupContainer: () => container,
                className: 'custom-tip',
                ...(showArrow === undefined ? {} : { showArrow }),
              },
            },
          },
        },
        slots: { default: () => h('strong', 'Complete rich content') },
      });
      try {
        await settle();
        const popup = container.querySelector('.semi-popover-wrapper')!;
        expect(popup).not.toBeNull();
        expect(popup.classList.contains('semi-typography-ellipsis-popover')).toBe(true);
        expect(popup.classList.contains('custom-tip')).toBe(true);
        expect(popup.querySelector('strong')?.textContent).toBe('Complete rich content');
        expect(Boolean(popup.querySelector('.semi-popover-icon-arrow'))).toBe(showArrow !== false);
        await wrapper.setProps({ ellipsis: false });
        expect(container.querySelector('.semi-popover-wrapper')).toBeNull();
        expect(wrapper.get('.semi-typography').text()).toBe('Complete rich content');
      } finally {
        wrapper.unmount();
      }
      expect(container.querySelector('.semi-portal')).toBeNull();
    });
  it('keeps the tooltip scoped slot and opts class without flattening the trigger', async () => {
    const wrapper = mount(Text, {
      props: {
        ellipsis: {
          showTooltip: {
            opts: { trigger: 'custom', visible: true, motion: false, className: 'custom-tip' },
          },
        },
      },
      slots: {
        default: () => h('strong', 'Original content'),
        tooltip: ({ content }: { content: string }) => h('em', `Tip: ${content}`),
      },
    });
    try {
      await settle();
      expect(document.querySelector('.semi-tooltip-wrapper.custom-tip em')?.textContent).toBe(
        'Tip: Original content',
      );
      expect(wrapper.get('.semi-typography strong').text()).toBe('Original content');
    } finally {
      wrapper.unmount();
    }
    expect(document.querySelector('.semi-tooltip-wrapper')).toBeNull();
  });
});
