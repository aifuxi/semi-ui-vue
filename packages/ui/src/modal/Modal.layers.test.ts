import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick, ref } from 'vue';

import { SideSheet } from '../side-sheet';
import { Modal } from './index';

/** 每个用例拥有的宿主，卸载时释放弹层及其 document 监听。 */
const wrappers: VueWrapper[] = [];
// 先释放组件生命周期，再清理测试文档。
afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
});

/** jsdom 不会根据 key 合成兼容键码；27 与真实浏览器 Escape 一致。 */
function escape(): void {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }),
  );
}

// 外层必须保持默认 closeOnEsc=true，不能通过消费者关闭保护掩盖问题。
it('一次 Escape 只通知最上层，最上层禁止 Esc 时也不穿透', async () => {
  /** 用于断言底层没有收到取消事件。 */
  const outerCancel = vi.fn();
  /** 顶层取消由受控调用方决定是否关闭。 */
  const innerCancel = vi.fn();
  /** 动态关闭保护不应改变层级。 */
  const closeOnEsc = ref(true);
  /** 仅通过公开组件与 props 构造标准双实例。 */
  const wrapper = mount(
    {
      // 两个同级实例对应业务详情和确认框的实际结构。
      render: () => [
        h(Modal, { visible: true, title: '外层', onCancel: outerCancel }),
        h(Modal, {
          visible: true,
          title: '内层',
          closeOnEsc: closeOnEsc.value,
          onCancel: innerCancel,
        }),
      ],
    },
    { attachTo: document.body },
  );
  wrappers.push(wrapper);
  await nextTick();
  escape();
  expect(innerCancel).toHaveBeenCalledTimes(1);
  expect(outerCancel).not.toHaveBeenCalled();
  closeOnEsc.value = false;
  await nextTick();
  escape();
  expect(innerCancel).toHaveBeenCalledTimes(1);
  expect(outerCancel).not.toHaveBeenCalled();
});

// zIndex 是公开配置，挂载较晚的低层不能抢走高层的 Esc。
it('按实际 zIndex 选择顶层，并在卸载后释放键盘所有权', async () => {
  /** 较高层先挂载，用来区分层级和监听器注册顺序。 */
  const upperCancel = vi.fn();
  /** 较低层始终可见。 */
  const lowerCancel = vi.fn();
  /** 独立挂载覆盖命令式弹窗的跨 Vue app 情况。 */
  const upper = mount(Modal, {
    attachTo: document.body,
    props: {
      visible: true,
      motion: false,
      title: '高层',
      zIndex: 1200,
      onCancel: upperCancel,
    },
  });
  /** 后挂载但 zIndex 较小，不应获得 Esc。 */
  const lower = mount(Modal, {
    attachTo: document.body,
    props: {
      visible: true,
      motion: false,
      title: '低层',
      zIndex: 1000,
      onCancel: lowerCancel,
    },
  });
  wrappers.push(lower);
  await nextTick();
  escape();
  expect(upperCancel).toHaveBeenCalledTimes(1);
  expect(lowerCancel).not.toHaveBeenCalled();
  upper.unmount();
  escape();
  expect(lowerCancel).toHaveBeenCalledTimes(1);
});

// 关闭重开与 keepDOM 分别覆盖销毁和保留内容两条路径。
it.each([
  [false, false],
  [false, true],
  [true, false],
  [true, true],
])('内层关闭后恢复焦点 keepDOM=%s，移除入口=%s', async (keepDOM, removeOpener) => {
  /** 模拟正常入口及 Dropdown 菜单项关闭后消失的情况。 */
  const showOpener = ref(true);
  /** 通过受控状态关闭和重开内层。 */
  const visible = ref(false);
  /** 保留外层实例，内层在它的默认插槽内打开。 */
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: { visible: true, motion: false, title: '外层', footer: null },
    slots: {
      // 入口和嵌套弹层都由普通 Vue 渲染生成，不操作组件内部状态。
      default: () => [
        showOpener.value ? h('button', { 'data-opener': '' }, '打开内层') : null,
        h(Modal, {
          visible: visible.value,
          motion: false,
          keepDOM,
          title: '内层',
          // 用户取消只更新内层状态，外层保持默认 Esc 行为。
          'onUpdate:visible': (value: boolean) => {
            visible.value = value;
          },
        }),
      ],
    },
  });
  wrappers.push(wrapper);
  await nextTick();
  /** 真实入口用于检查焦点是否返回原来的元素。 */
  const opener = document.querySelector<HTMLButtonElement>('[data-opener]')!;
  opener.focus();
  visible.value = true;
  if (removeOpener) showOpener.value = false;
  await nextTick();
  await nextTick();
  escape();
  await nextTick();
  if (!removeOpener) expect(document.activeElement).toBe(opener);
  expect(document.querySelector('[role="dialog"]')?.contains(document.activeElement)).toBe(true);
  expect(document.activeElement).not.toBe(document.body);
});

describe('弹层共享页面滚动锁', () => {
  const lockedWidth = 'calc(80% - 15px)';
  let originalBodyStyle: string | null;
  const overlays: VueWrapper[] = [];

  beforeEach(() => {
    originalBodyStyle = document.body.getAttribute('style');
    document.body.style.overflow = 'auto';
    document.body.style.width = '80%';
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(
      window.innerWidth - 15,
    );
  });

  afterEach(() => {
    for (const overlay of overlays.splice(0)) overlay.unmount();
    if (originalBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', originalBodyStyle);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function mountOverlay(
    kind: 'Modal' | 'SideSheet',
    title: string,
    getPopupContainer?: () => HTMLElement,
  ) {
    const options = {
      attachTo: document.body,
      props: {
        visible: true,
        motion: false,
        title,
        ...(getPopupContainer ? { getPopupContainer } : {}),
      },
    };
    const overlay: VueWrapper =
      kind === 'Modal' ? mount(Modal, options) : mount(SideSheet, options);
    overlays.push(overlay);
    return overlay;
  }

  function expectLocked() {
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.width).toBe(lockedWidth);
  }

  function expectRestored() {
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.width).toBe('80%');
  }

  it.each([
    ['Modal', 'Modal', 0],
    ['Modal', 'Modal', 1],
    ['Modal', 'SideSheet', 0],
    ['SideSheet', 'Modal', 0],
  ] as const)('%s 与 %s 交错关闭，先关闭索引 %s', async (firstKind, secondKind, firstToClose) => {
    const first = mountOverlay(firstKind, '先打开');
    await nextTick();
    expectLocked();
    const second = mountOverlay(secondKind, '后打开');
    await nextTick();
    expectLocked();

    const [closing, remaining] = firstToClose === 0 ? [first, second] : [second, first];
    await closing.setProps({ visible: false });
    expect(document.body.textContent).toContain(firstToClose === 0 ? '后打开' : '先打开');
    expectLocked();

    remaining.unmount();
    overlays.splice(overlays.indexOf(remaining), 1);
    expectRestored();
  });

  it('自定义容器中的 SideSheet 不延长 Modal 的页面滚动锁', async () => {
    const target = document.body.appendChild(document.createElement('div'));
    const modal = mountOverlay('Modal', '页面弹窗');
    mountOverlay('SideSheet', '局部侧栏', () => target);
    await nextTick();
    expect(target.textContent).toContain('局部侧栏');
    expectLocked();

    await modal.setProps({ visible: false });
    expect(target.textContent).toContain('局部侧栏');
    expectRestored();
  });

  it('Modal 在退场中重开后最终释放滚动锁，并在恢复样式后通知关闭', async () => {
    vi.useFakeTimers();
    const afterClose = vi.fn(() => [document.body.style.overflow, document.body.style.width]);
    const modal = mount(Modal, {
      attachTo: document.body,
      props: { visible: true, motion: true, title: '重开弹窗', afterClose },
    });
    overlays.push(modal);
    await nextTick();
    expectLocked();

    await modal.setProps({ visible: false });
    expectLocked();
    await modal.setProps({ visible: true });
    await vi.advanceTimersByTimeAsync(180);
    expect(document.body.textContent).toContain('重开弹窗');
    expectLocked();
    expect(afterClose).not.toHaveBeenCalled();

    await modal.setProps({ visible: false });
    expectLocked();
    await vi.advanceTimersByTimeAsync(180);
    await nextTick();
    expect(document.body.textContent).not.toContain('重开弹窗');
    expectRestored();
    expect(afterClose).toHaveBeenCalledTimes(1);
    expect(afterClose).toHaveReturnedWith(['auto', '80%']);
  });

  it.each(['Modal', 'SideSheet'] as const)('%s 的滚动锁跟随实际 Portal 容器', async (kind) => {
    const target = document.body.appendChild(document.createElement('div'));
    const overlay = mountOverlay(kind, '移动弹层', () => document.body);
    await nextTick();
    expectLocked();

    await overlay.setProps({ getPopupContainer: () => target });
    expect(target.textContent).toContain('移动弹层');
    expectRestored();
    await overlay.setProps({ getPopupContainer: () => document.body });
    expect(target.textContent).not.toContain('移动弹层');
    expectLocked();
    await overlay.setProps({ visible: false });
    expectRestored();
  });

  it('原有的内联隐藏和宽度从打开到关闭保持原值', async () => {
    document.body.style.setProperty('overflow', 'hidden', 'important');
    const modal = mountOverlay('Modal', '页面弹窗');
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(document.body.style.width).toBe('80%');

    await modal.setProps({ visible: false });
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(document.body.style.width).toBe('80%');
  });

  it('最后退出时恢复内联值的优先级及原本缺省的宽度', async () => {
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.body.style.removeProperty('width');
    const modal = mountOverlay('Modal', '页面弹窗');
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.width).toBe('calc(100% - 15px)');

    await modal.setProps({ visible: false });
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(document.body.style.width).toBe('');
  });
});
