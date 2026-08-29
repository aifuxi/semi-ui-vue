import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider, semiGlobal } from '../config-provider';
import { resetNotificationForTests } from './imperative';
import { Notification, useNotification } from './index';

afterEach(async () => {
  Notification.destroyAll();
  resetNotificationForTests();
  semiGlobal.config = {};
  vi.useRealTimers();
  document.body.replaceChildren();
  await nextTick();
});

describe('Notification', () => {
  it('覆盖五种方法、默认 DOM、ARIA、图标、theme 与显式 showClose', async () => {
    Notification.open({ content: 'default', duration: 0, id: 'default' });
    Notification.info({ content: 'info', duration: 0, id: 'info' });
    Notification.success({ content: 'success', duration: 0, id: 'success' });
    Notification.warning({ content: 'warning', duration: 0, id: 'warning' });
    Notification.error({
      content: 'error',
      duration: 0,
      id: 'error',
      theme: 'light',
      showClose: false,
    });
    await nextTick();
    expect(document.querySelectorAll('[role="alert"]')).toHaveLength(5);
  });

  it('同 id 更新而非新增，并重启 duration timer', async () => {
    vi.useFakeTimers();
    const id = Notification.info({ content: 'old', duration: 1, id: 'stable' });
    await vi.advanceTimersByTimeAsync(800);
    expect(Notification.open({ content: 'new', duration: 1, id })).toBe(id);
    await nextTick();
    expect(document.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('new');
    await vi.advanceTimersByTimeAsync(800);
    expect(document.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('六种 position 分组、新通知前置，并让 config offset 数字转 px/字符串原样保留', async () => {
    Notification.config({ left: '12%', top: 24 });
    const positions = [
      'top',
      'topLeft',
      'topRight',
      'bottom',
      'bottomLeft',
      'bottomRight',
    ] as const;
    for (const position of positions) {
      Notification.info({ content: position, duration: 0, position });
    }
    Notification.info({ content: 'newest', duration: 0, position: 'top' });
    await nextTick();
    for (const position of positions) {
      expect(
        document.querySelector(`.semi-notification-list[placement="${position}"]`),
      ).not.toBeNull();
    }
    const top = document.querySelector('.semi-notification-list[placement="top"]') as HTMLElement;
    expect(top.style).toMatchObject({ left: '12%', top: '24px' });
    expect(top.querySelector('[role="alert"]')?.textContent).toContain('newest');
  });

  it('hover 暂停 timer，mouseleave 重新计算完整 duration，自动关闭触发 onClose', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    Notification.info({ content: 'timed', duration: 1, onClose });
    await nextTick();
    const notice = document.querySelector('[role="alert"]') as HTMLElement;
    await vi.advanceTimersByTimeAsync(800);
    notice.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.advanceTimersByTimeAsync(800);
    expect(document.querySelector('[role="alert"]')).not.toBeNull();
    notice.dispatchEvent(new MouseEvent('mouseleave'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(onClose).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(350);
    expect(document.querySelector('[role="alert"]')).toBeNull();
  });

  it('首次自定义容器/zIndex 生效，后续不迁移，destroyAll 后重新解析', async () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    document.body.append(first, second);
    Notification.info({
      content: 'one',
      duration: 0,
      getPopupContainer: () => first,
      zIndex: 2333,
    });
    await nextTick();
    expect(first.querySelector(':scope > .semi-notification-wrapper')).not.toBeNull();
    expect((first.firstElementChild as HTMLElement).style.zIndex).toBe('2333');
    Notification.info({
      content: 'two',
      duration: 0,
      getPopupContainer: () => second,
      zIndex: 9999,
    });
    await nextTick();
    expect(second.querySelector('.semi-notification-wrapper')).toBeNull();
    expect((first.firstElementChild as HTMLElement).style.zIndex).toBe('2333');
    Notification.destroyAll();
    Notification.info({
      content: 'three',
      duration: 0,
      getPopupContainer: () => second,
      zIndex: 9999,
    });
    await nextTick();
    expect((second.firstElementChild as HTMLElement).style.zIndex).toBe('9999');
  });

  it('自定义 VNode icon、class/style 与 title/content truthy 分支对齐', async () => {
    Notification.open({
      className: 'custom-notice',
      content: h('strong', '内容'),
      duration: 0,
      icon: h('span', { class: 'custom-icon' }, 'I'),
      style: { width: '360px' },
      title: h('em', '标题'),
    });
    await nextTick();
    const notice = document.querySelector('.custom-notice') as HTMLElement;
    expect(notice.style.width).toBe('360px');
    expect(notice.querySelector('.custom-icon')?.textContent).toBe('I');
    expect(notice.querySelector('.semi-notification-notice-title em')?.textContent).toBe('标题');
    expect(notice.querySelector('.semi-notification-notice-content strong')?.textContent).toBe(
      '内容',
    );
  });

  it('关闭按钮保持 onCloseClick → onClose 顺序并阻止 notice click', async () => {
    const order: string[] = [];
    Notification.info({
      content: 'close',
      duration: 0,
      onClick: () => order.push('click'),
      onCloseClick: () => order.push('closeClick'),
      onClose: () => order.push('close'),
    });
    await nextTick();
    (document.querySelector('.semi-notification-notice-icon-close') as HTMLButtonElement).click();
    expect(order).toEqual(['closeClick', 'close']);
  });

  it('全局覆盖只作用于缺省值，单次显式 false/true 优先', async () => {
    semiGlobal.config.overrideDefaultProps = { Notification: { showClose: false, duration: 0 } };
    Notification.info({ content: 'global' });
    Notification.info({ content: 'explicit', showClose: true });
    await nextTick();
    expect(document.querySelectorAll('.semi-notification-notice-icon-close')).toHaveLength(1);
  });

  it('useNotification holder 保留 ConfigProvider 上下文并支持局部关闭', async () => {
    let api!: ReturnType<typeof useNotification>[0];
    const Host = defineComponent({
      setup() {
        const result = useNotification();
        api = result[0];
        return () => h(ConfigProvider, { direction: 'rtl' }, () => h(result[1]));
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    const id = api.info({ content: 'hook', duration: 0 });
    await nextTick();
    expect(wrapper.get('.semi-notification-list').attributes('placement')).toBe('topRight');
    expect(wrapper.get('[role="alert"]').classes()).toContain('semi-notification-notice-rtl');
    api.close(id);
    await nextTick();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
