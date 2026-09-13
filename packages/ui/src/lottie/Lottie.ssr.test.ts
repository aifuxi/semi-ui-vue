import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

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
    const container = {} as Element;
    const html = await renderToString(h(Lottie, { params: { animationData: {}, container } }));
    expect(html).toBe('<!---->');
    expect(lottieMock.loadAnimation).not.toHaveBeenCalled();
  });
});
