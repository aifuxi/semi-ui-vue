import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const lottieMock = vi.hoisted(() => ({ loadAnimation: vi.fn() }));

vi.mock('lottie-web', () => ({ default: lottieMock }));

import Lottie from './Lottie.vue';

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

describe('Lottie SSR', () => {
  it('服务端输出内部容器且不启动播放器', async () => {
    const html = await renderToString(
      h(Lottie, {
        'aria-label': 'Animation',
        className: 'custom-lottie',
        height: '80px',
        params: { animationData: {} },
        width: '120px',
      }),
    );
    expect(html).toContain('class="semi-lottie custom-lottie"');
    expect(html).toContain('aria-label="Animation"');
    expect(html).toContain('width:120px');
    expect(html).toContain('height:80px');
    expect(lottieMock.loadAnimation).not.toHaveBeenCalled();
  });

  it('外部容器模式服务端输出注释节点且不访问容器', async () => {
    const container = document.createElement('div');
    const html = await renderToString(h(Lottie, { params: { animationData: {}, container } }));
    expect(html).toBe('<!--v-if-->');
    expect(lottieMock.loadAnimation).not.toHaveBeenCalled();
  });

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
