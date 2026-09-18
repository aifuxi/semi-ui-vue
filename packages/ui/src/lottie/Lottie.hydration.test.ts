import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

const lottieMock = vi.hoisted(() => ({ loadAnimation: vi.fn() }));

vi.mock('lottie-web', () => ({ default: lottieMock }));

import Lottie from './index';

function createAnimation() {
  return { destroy: vi.fn(), goToAndStop: vi.fn(), play: vi.fn() };
}

beforeEach(() => {
  lottieMock.loadAnimation.mockReset();
  lottieMock.loadAnimation.mockImplementation(createAnimation);
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Lottie hydration', () => {
  it('hydration 后创建实例，卸载完整销毁且无 warning', async () => {
    const getAnimationInstance = vi.fn();
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(Lottie, { getAnimationInstance, params: { animationData: {} } }),
    };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    const animation = lottieMock.loadAnimation.mock.results[0]?.value;

    expect(lottieMock.loadAnimation).toHaveBeenCalledOnce();
    expect(getAnimationInstance).toHaveBeenCalledTimes(2);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    expect(animation.destroy).toHaveBeenCalledOnce();
  });
});
