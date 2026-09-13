import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, type VNodeChild } from 'vue';

import UserGuide from './UserGuide.vue';
import type { UserGuideStepItem } from './types';

const originalRaf = globalThis.requestAnimationFrame;
const originalCancelRaf = globalThis.cancelAnimationFrame;

function target(id = 'guide-target'): HTMLElement {
  const element = document.createElement('button');
  element.id = id;
  element.getBoundingClientRect = () => new DOMRect(100, 120, 80, 32);
  document.body.append(element);
  return element;
}

function steps(element: Element): UserGuideStepItem[] {
  return [
    { target: element, title: 'First', description: 'One' },
    { target: element, title: 'Second', description: 'Two' },
  ];
}

function buttonWithText(text: string): HTMLButtonElement | undefined {
  return [...document.querySelectorAll('button')].find((button) =>
    button.textContent?.includes(text),
  );
}

beforeEach(() => {
  globalThis.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  globalThis.cancelAnimationFrame = vi.fn();
});

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  document.body.style.width = '';
  globalThis.requestAnimationFrame = originalRaf;
  globalThis.cancelAnimationFrame = originalCancelRaf;
});

describe('UserGuide', () => {
  it('keeps default true booleans distinct from explicit false', async () => {
    const element = target();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: { visible: true, steps: steps(element), mask: false, showSkipButton: false },
    });
    await nextTick();
    expect(document.querySelector('.semi-userGuide-spotlight-transparent-rect')).toBeNull();
    expect(document.body.textContent).not.toContain('跳过');
    wrapper.unmount();
  });

  it('emits public step events in order for uncontrolled navigation', async () => {
    const element = target();
    const calls: string[] = [];
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: {
        visible: true,
        steps: steps(element),
        onChange: (value: number) => calls.push(`change:${value}`),
        onNext: (value: number) => calls.push(`next:${value}`),
      },
    });
    await nextTick();
    const next = buttonWithText('下一步');
    next?.click();
    await flushPromises();
    expect(calls).toEqual(['change:1', 'next:1']);
    expect(document.body.textContent).toContain('Second');
    wrapper.unmount();
  });

  it('does not mutate a controlled current value before parent write-back', async () => {
    const element = target();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: { current: 0, visible: true, steps: steps(element) },
    });
    await nextTick();
    const next = buttonWithText('下一步');
    next?.click();
    await nextTick();
    expect(wrapper.emitted('change')).toEqual([[1]]);
    expect(wrapper.emitted('update:current')).toEqual([[1]]);
    expect(document.body.textContent).toContain('First');

    await wrapper.setProps({ current: 1 });
    await nextTick();
    expect(document.body.textContent).toContain('Second');
    buttonWithText('上一步')?.click();
    await nextTick();
    expect(wrapper.emitted('change')).toEqual([[1], [0]]);
    expect(wrapper.emitted('prev')).toEqual([[0]]);
    wrapper.unmount();
  });

  it('supports target functions that temporarily return null', async () => {
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: {
        visible: true,
        steps: [{ target: () => null, title: 'Missing' }],
      },
    });
    await nextTick();
    expect(document.querySelector('.semi-userGuide-popover')).toBeNull();
    expect(document.querySelector('.semi-userGuide-spotlight')).toBeNull();
    wrapper.unmount();
  });

  it('emits prev, skip and finish according to the pinned event contract', async () => {
    const element = target();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: { visible: true, steps: steps(element) },
    });
    await nextTick();
    buttonWithText('跳过')?.click();
    expect(wrapper.emitted('skip')).toEqual([[]]);

    buttonWithText('下一步')?.click();
    await flushPromises();
    buttonWithText('上一步')?.click();
    await flushPromises();
    expect(wrapper.emitted('change')).toEqual([[1], [0]]);
    expect(wrapper.emitted('prev')).toEqual([[0]]);

    buttonWithText('下一步')?.click();
    await flushPromises();
    buttonWithText('完成')?.click();
    expect(wrapper.emitted('finish')).toEqual([[]]);
    expect(wrapper.emitted('next')).toEqual([[1], [1]]);
    wrapper.unmount();
  });

  it('keeps the documented step mask field aligned with the pinned runtime deviation', async () => {
    const element = target();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: {
        visible: true,
        mask: true,
        steps: [{ target: element, title: 'Masked', mask: false }],
      },
    });
    await nextTick();
    expect(document.querySelectorAll('.semi-userGuide-spotlight-transparent-rect')).toHaveLength(4);
    wrapper.unmount();
  });

  it('renders modal cover, indicator and button overrides through the existing Modal', async () => {
    const onClick = vi.fn();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: {
        visible: true,
        mode: 'modal',
        steps: [
          { cover: h('img', { alt: 'Guide cover' }), title: 'Modal first', description: 'Body' },
          { title: 'Modal second' },
        ],
        nextButtonProps: { content: 'Continue', onClick, theme: 'outline' },
      },
    });
    await flushPromises();
    expect(document.querySelector('.semi-userGuide-modal-cover img')?.getAttribute('alt')).toBe(
      'Guide cover',
    );
    expect(document.querySelectorAll('.semi-userGuide-modal-indicator-item')).toHaveLength(2);
    const next = buttonWithText('Continue');
    expect(next?.classList.contains('semi-button-outline')).toBe(true);
    next?.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted('next')).toBeUndefined();
    wrapper.unmount();
  });

  it('uses scoped slots before step VNode fields', async () => {
    const element = target();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            UserGuide,
            { visible: true, steps: [{ target: element, title: 'Prop title' }] },
            { title: ({ index }: { index: number }): VNodeChild => h('strong', `Slot ${index}`) },
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();
    expect(document.body.textContent).toContain('Slot 0');
    expect(document.body.textContent).not.toContain('Prop title');
    wrapper.unmount();
  });

  it('restores body styles on hide and unmount while respecting custom-container intent', async () => {
    const element = target();
    const wrapper = mount(UserGuide, {
      attachTo: document.body,
      props: { visible: false, steps: steps(element) },
    });
    await nextTick();
    await wrapper.setProps({ visible: true });
    expect(document.body.style.overflow).toBe('hidden');
    await wrapper.setProps({ visible: false });
    expect(document.body.style.overflow).toBe('');
    wrapper.unmount();

    const custom = mount(UserGuide, {
      attachTo: document.body,
      props: { visible: false, steps: steps(element), getPopupContainer: () => element },
    });
    await nextTick();
    await custom.setProps({ visible: true });
    expect(document.body.style.overflow).toBe('');
    custom.unmount();
  });
});
