import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const lottieMock = vi.hoisted(() => ({
  loadAnimation: vi.fn(),
}));

vi.mock('lottie-web', () => ({ default: lottieMock }));

import { semiGlobal } from '../config-provider';
import LottieBase from './Lottie.vue';
import { Lottie } from './index';

function createAnimation() {
  return { destroy: vi.fn(), goToAndStop: vi.fn(), play: vi.fn() };
}

beforeEach(() => {
  semiGlobal.config = {};
  lottieMock.loadAnimation.mockReset();
  lottieMock.loadAnimation.mockImplementation(createAnimation);
});

afterEach(() => {
  semiGlobal.config = {};
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Lottie', () => {
  it('创建内部容器并按固定顺序合并 class/style/attrs', () => {
    const wrapper = mount(LottieBase, {
      attrs: { 'aria-label': 'Loading animation', 'data-lottie': 'basic', role: 'img' },
      props: {
        class: 'class-prop',
        className: 'class-name-prop',
        height: '80px',
        params: { animationData: { v: '5.13.0' }, autoplay: false, loop: false },
        style: { height: '90px', width: '140px' },
        width: '120px',
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-lottie', 'class-prop', 'class-name-prop']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': 'Loading animation',
      'data-lottie': 'basic',
      role: 'img',
    });
    expect((wrapper.element as HTMLElement).style.width).toBe('140px');
    expect((wrapper.element as HTMLElement).style.height).toBe('90px');
    expect(lottieMock.loadAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        animationData: { v: '5.13.0' },
        autoplay: false,
        container: wrapper.element,
        loop: false,
        renderer: 'svg',
      }),
    );
  });

  it('保留初次实例双回调、全局包回调与静态 getLottie', () => {
    const getAnimationInstance = vi.fn();
    const getLottie = vi.fn();
    const wrapper = mount(LottieBase, {
      props: { getAnimationInstance, getLottie, params: { animationData: {} } },
    });
    const animation = lottieMock.loadAnimation.mock.results[0]?.value;

    expect(getAnimationInstance).toHaveBeenCalledTimes(2);
    expect(getAnimationInstance).toHaveBeenNthCalledWith(1, animation);
    expect(getAnimationInstance).toHaveBeenNthCalledWith(2, animation);
    expect(getLottie).toHaveBeenCalledOnce();
    expect(getLottie).toHaveBeenCalledWith(lottieMock);
    expect(Lottie.getLottie()).toBe(lottieMock);
    wrapper.unmount();
  });

  it('使用外部 container 时不渲染内部根，且不转移 attrs', () => {
    const container = document.createElement('section');
    container.className = 'owned-by-caller';
    document.body.append(container);
    const wrapper = mount(LottieBase, {
      attrs: { 'aria-label': 'Ignored without an internal root' },
      props: { className: 'ignored-class', params: { animationData: {}, container } },
    });

    expect(wrapper.html()).toBe('<!--v-if-->');
    expect(container.className).toBe('owned-by-caller');
    expect(container.hasAttribute('aria-label')).toBe(false);
    expect(lottieMock.loadAnimation).toHaveBeenCalledWith(expect.objectContaining({ container }));
  });

  it('深度等价 params 不重建，变化时先销毁旧实例再创建新实例', async () => {
    const getAnimationInstance = vi.fn();
    const firstParams = { animationData: { layers: [{ id: 1 }] }, autoplay: false };
    const wrapper = mount(LottieBase, { props: { getAnimationInstance, params: firstParams } });
    const firstAnimation = lottieMock.loadAnimation.mock.results[0]?.value;

    await wrapper.setProps({
      params: { animationData: { layers: [{ id: 1 }] }, autoplay: false },
    });
    await nextTick();
    expect(lottieMock.loadAnimation).toHaveBeenCalledOnce();

    await wrapper.setProps({
      params: { animationData: { layers: [{ id: 2 }] }, autoplay: false },
    });
    await nextTick();
    expect(firstAnimation.destroy).toHaveBeenCalledOnce();
    expect(lottieMock.loadAnimation).toHaveBeenCalledTimes(2);
    expect(getAnimationInstance).toHaveBeenCalledTimes(3);
    expect(getAnimationInstance).toHaveBeenLastCalledWith(
      lottieMock.loadAnimation.mock.results[1]?.value,
    );
  });

  it('更新回调不重建动画，后续 params 更新读取最新回调', async () => {
    const original = vi.fn();
    const updated = vi.fn();
    const wrapper = mount(LottieBase, {
      props: { getAnimationInstance: original, params: { animationData: { id: 1 } } },
    });

    await wrapper.setProps({ getAnimationInstance: updated });
    expect(lottieMock.loadAnimation).toHaveBeenCalledOnce();
    await wrapper.setProps({ params: { animationData: { id: 2 } } });
    await nextTick();

    expect(original).toHaveBeenCalledTimes(2);
    expect(updated).toHaveBeenCalledOnce();
    expect(updated).toHaveBeenCalledWith(lottieMock.loadAnimation.mock.results[1]?.value);
  });

  it('卸载只销毁当前 animation，外部容器保持由调用方拥有', () => {
    const container = document.createElement('section');
    document.body.append(container);
    const wrapper = mount(LottieBase, { props: { params: { animationData: {}, container } } });
    const animation = lottieMock.loadAnimation.mock.results[0]?.value;

    wrapper.unmount();
    expect(animation.destroy).toHaveBeenCalledOnce();
    expect(document.body.contains(container)).toBe(true);
  });

  it('读取 ConfigProvider 全局默认值但显式值优先', () => {
    semiGlobal.config.overrideDefaultProps = {
      Lottie: { height: '88px', params: { animationData: { source: 'global' } }, width: '96px' },
    };
    const inherited = mount(LottieBase);
    expect((inherited.element as HTMLElement).style.width).toBe('96px');
    expect(lottieMock.loadAnimation).toHaveBeenLastCalledWith(
      expect.objectContaining({ animationData: { source: 'global' } }),
    );
    inherited.unmount();

    const explicit = mount(LottieBase, {
      props: { params: { animationData: { source: 'explicit' } }, width: '64px' },
    });
    expect((explicit.element as HTMLElement).style.width).toBe('64px');
    expect(lottieMock.loadAnimation).toHaveBeenLastCalledWith(
      expect.objectContaining({ animationData: { source: 'explicit' } }),
    );
  });
});
