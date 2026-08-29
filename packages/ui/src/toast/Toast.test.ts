import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { IconHome } from '@workspace/icons';

import { ConfigProvider, semiGlobal } from '../config-provider';

import { resetToastSeedsForTests } from './imperative';
import { Toast, ToastFactory, useToast } from './index';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Toast.destroyAll();
    semiGlobal.config = {};
    resetToastSeedsForTests();
  });

  afterEach(() => {
    Toast.destroyAll();
    semiGlobal.config = {};
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('支持四种静态方法、字符串简写、默认图标与 alert 语义', async () => {
    Toast.info({ content: 'Info', duration: 0, motion: false });
    Toast.success({ content: 'Success', duration: 0, motion: false });
    Toast.warning('Warning');
    Toast.error({ content: 'Error', duration: 0, motion: false });
    await nextTick();

    const alerts = [...document.querySelectorAll<HTMLElement>('.semi-toast')];
    expect(alerts).toHaveLength(4);
    expect(alerts.map((alert) => alert.getAttribute('aria-label'))).toEqual([
      'info type',
      'success type',
      'warning type',
      'error type',
    ]);
    expect(alerts.map((alert) => alert.getAttribute('role'))).toEqual([
      'alert',
      'alert',
      'alert',
      'alert',
    ]);
    expect(document.querySelector('.semi-toast-icon-info')).not.toBeNull();
    expect(document.querySelector('.semi-toast-icon-success')).not.toBeNull();
    expect(document.querySelector('.semi-toast-icon-warning')).not.toBeNull();
    expect(document.querySelector('.semi-toast-icon-error')).not.toBeNull();
  });

  it('区分 showClose 缺省、显式 false/true，并保留样式和文本宽度', async () => {
    Toast.info({ content: 'Default', duration: 0, id: 'default', motion: false });
    Toast.info({ content: 'Hidden', duration: 0, id: 'hidden', motion: false, showClose: false });
    Toast.info({
      className: 'custom-toast',
      content: 'Shown',
      duration: 0,
      id: 'shown',
      motion: false,
      showClose: true,
      style: { color: 'rgb(1, 2, 3)' },
      textMaxWidth: 240,
      theme: 'light',
    });
    await nextTick();

    const alerts = [...document.querySelectorAll<HTMLElement>('.semi-toast')];
    expect(alerts[0]?.querySelector('.semi-toast-close-button')).not.toBeNull();
    expect(alerts[1]?.querySelector('.semi-toast-close-button')).toBeNull();
    expect(alerts[2]?.classList.contains('custom-toast')).toBe(true);
    expect(alerts[2]?.classList.contains('semi-toast-light')).toBe(true);
    expect(alerts[2]?.style.color).toBe('rgb(1, 2, 3)');
    expect(alerts[2]?.querySelector<HTMLElement>('.semi-toast-content-text')?.style.maxWidth).toBe(
      '240px',
    );
  });

  it('原样渲染任意自定义图标，并为 Semi 图标补齐 large 尺寸和 Toast class', async () => {
    Toast.info({
      content: 'Plain custom icon',
      duration: 0,
      icon: h('span', { class: 'plain-custom-icon' }, 'P'),
      motion: false,
      showClose: false,
    });
    Toast.info({
      content: 'Semi custom icon',
      duration: 0,
      icon: h(IconHome),
      motion: false,
      showClose: false,
    });
    await nextTick();

    expect(document.querySelector('.plain-custom-icon')?.textContent).toBe('P');
    const semiIcon = document.querySelector('.semi-icon-home');
    expect(semiIcon?.classList.contains('semi-toast-icon')).toBe(true);
    expect(semiIcon?.classList.contains('semi-icon-large')).toBe(true);
    expect(document.querySelectorAll('.semi-toast-icon-info')).toHaveLength(0);
  });

  it('相同 id 原位更新内容和类型并重启自动关闭计时', async () => {
    Toast.info({ content: 'Before', duration: 3, id: 7, motion: false });
    await vi.advanceTimersByTimeAsync(2000);
    Toast.success({ content: 'After', duration: 3, id: 7, motion: false });
    await nextTick();

    expect(document.querySelectorAll('.semi-toast')).toHaveLength(1);
    expect(document.querySelector('.semi-toast')?.textContent).toContain('After');
    expect(document.querySelector('.semi-toast')?.classList.contains('semi-toast-success')).toBe(
      true,
    );
    await vi.advanceTimersByTimeAsync(2000);
    expect(document.querySelector('.semi-toast')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(1000);
    expect(document.querySelector('.semi-toast')).toBeNull();
  });

  it('hover 暂停，mouseleave 从完整 duration 重新计时', async () => {
    Toast.info({ content: 'Timer', duration: 2, motion: false });
    const alert = document.querySelector<HTMLElement>('.semi-toast');
    expect(alert).not.toBeNull();
    alert?.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.advanceTimersByTimeAsync(4000);
    expect(document.querySelector('.semi-toast')).not.toBeNull();
    alert?.dispatchEvent(new MouseEvent('mouseleave'));
    await vi.advanceTimersByTimeAsync(1999);
    expect(document.querySelector('.semi-toast')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(document.querySelector('.semi-toast')).toBeNull();
  });

  it('关闭按钮阻止冒泡、关闭单条并只调用一次 onClose', async () => {
    const onClose = vi.fn();
    const parentClick = vi.fn();
    document.body.addEventListener('click', parentClick);
    Toast.info({ content: 'Close me', duration: 0, motion: false, onClose });
    const button = document.querySelector<HTMLButtonElement>('.semi-toast-close-button button');
    button?.click();
    await nextTick();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
    expect(document.querySelector('.semi-toast')).toBeNull();
    expect(document.querySelector('.semi-toast-wrapper')).not.toBeNull();
    document.body.removeEventListener('click', parentClick);
  });

  it('首次创建应用 container/zIndex/offset，后续调用不迁移 wrapper', async () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    document.body.append(first, second);
    const instance = ToastFactory.create({
      getPopupContainer: () => first,
      right: '12%',
      top: 24,
      zIndex: 2200,
    });
    instance.info({ content: 'First', duration: 0, motion: false });
    await nextTick();
    const wrapper = first.querySelector<HTMLElement>('.semi-toast-wrapper');
    expect(wrapper?.style.top).toBe('24px');
    expect(wrapper?.style.right).toBe('12%');
    expect(wrapper?.style.zIndex).toBe('2200');

    instance.info({
      content: 'Second',
      duration: 0,
      getPopupContainer: () => second,
      left: 8,
      motion: false,
      zIndex: 3300,
    });
    await nextTick();
    expect(first.querySelectorAll('.semi-toast-wrapper')).toHaveLength(1);
    expect(second.querySelector('.semi-toast-wrapper')).toBeNull();
    expect(wrapper?.style.left).toBe('8px');
    expect(wrapper?.style.zIndex).toBe('2200');
    instance.destroyAll();
    expect(first.querySelector('.semi-toast-wrapper')).toBeNull();
  });

  it('ToastFactory 实例的 wrapper、配置与 destroyAll 相互隔离', async () => {
    const one = ToastFactory.create({ top: 10 });
    const two = ToastFactory.create({ top: 20 });
    one.info({ content: 'One', duration: 0, motion: false });
    two.info({ content: 'Two', duration: 0, motion: false });
    await nextTick();
    expect(document.querySelectorAll('.semi-toast-wrapper')).toHaveLength(2);
    expect(document.querySelectorAll<HTMLElement>('.semi-toast-wrapper')[0]?.style.top).toBe(
      '10px',
    );
    expect(document.querySelectorAll<HTMLElement>('.semi-toast-wrapper')[1]?.style.top).toBe(
      '20px',
    );
    one.destroyAll();
    expect(document.body.textContent).not.toContain('One');
    expect(document.body.textContent).toContain('Two');
    two.destroyAll();
  });

  it('全局默认值低于单次 options，stack 生成 zero-height wrapper 并可 hover 展开', async () => {
    semiGlobal.config.overrideDefaultProps = {
      Toast: { showClose: false, theme: 'light' },
    };
    Toast.info({ content: 'First', duration: 0, motion: false, stack: true });
    Toast.warning({
      content: 'Second',
      duration: 0,
      motion: false,
      showClose: true,
      stack: true,
      theme: 'normal',
    });
    await nextTick();
    expect(document.querySelectorAll('.semi-toast-zero-height-wrapper')).toHaveLength(2);
    expect(document.querySelectorAll('.semi-toast-light')).toHaveLength(1);
    expect(document.querySelectorAll('.semi-toast-close-button')).toHaveLength(1);
    document.querySelector('.semi-toast-innerWrapper')?.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    expect(
      document
        .querySelector('.semi-toast-innerWrapper')
        ?.classList.contains('semi-toast-innerWrapper-hover'),
    ).toBe(true);
  });

  it('useToast holder 就地渲染、支持 open，并读取 ConfigProvider RTL', async () => {
    const Root = defineComponent({
      setup() {
        const [api, Holder] = useToast();
        onMounted(() => api.open({ content: 'Hook toast', duration: 0, showClose: false }));
        return () => h(ConfigProvider, { direction: 'rtl' }, () => h(Holder));
      },
    });
    const wrapper = mount(Root, { attachTo: document.body });
    await nextTick();
    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.classes()).toContain('semi-toast-default');
    expect(alert.classes()).toContain('semi-toast-rtl');
    expect(alert.attributes('aria-label')).toBe('default type');
    wrapper.unmount();
  });
});
