import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VideoPlayer from './VideoPlayer.vue';

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('VideoPlayer SSR', () => {
  it('服务端渲染静态 video/poster/progress/controls 且无媒体或全局副作用', async () => {
    const documentAdd = vi.spyOn(document, 'addEventListener');
    const mediaAdd = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const html = await renderToString(
      h(VideoPlayer, {
        src: '/video.mp4',
        poster: '/poster.webp',
        width: 500,
        height: 280,
        className: 'ssr-player',
      }),
    );
    expect(html).toContain('semi-videoPlayer');
    expect(html).toContain('ssr-player');
    expect(html).toContain('<video');
    expect(html).toContain('<track kind="captions"');
    expect(html).toContain('src="/poster.webp"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('semi-videoPlayer-controls-menu');
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(documentAdd).not.toHaveBeenCalled();
    expect(mediaAdd).not.toHaveBeenCalled();
  });

  it('显式 clickToPlay=false 和 controlsList 在 SSR 保留公开 DOM 契约', async () => {
    const html = await renderToString(
      h(VideoPlayer, { src: '/video.mp4', clickToPlay: false, controlsList: ['play', 'time'] }),
    );
    expect(html).toContain('semi-videoPlayer-controls-time');
    expect(html).not.toContain('semi-videoPlayer-controls-popup');
    expect(html.match(/semi-videoPlayer-controls-menu-button/g)).toHaveLength(1);
  });

  it('hydration 后注册一组监听并在卸载时以相同引用清理', async () => {
    const documentAdd = vi.spyOn(document, 'addEventListener');
    const documentRemove = vi.spyOn(document, 'removeEventListener');
    const mediaAdd = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const mediaRemove = vi.spyOn(HTMLMediaElement.prototype, 'removeEventListener');
    const Host = { render: () => h(VideoPlayer, { src: '/video.mp4' }) };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    const keydownAdd = documentAdd.mock.calls.find(([name]) => name === 'keydown');
    const fullscreenAdd = documentAdd.mock.calls.find(([name]) => name === 'fullscreenchange');
    const pipAdd = mediaAdd.mock.calls.find(([name]) => name === 'leavepictureinpicture');
    expect(keydownAdd).toBeTruthy();
    expect(fullscreenAdd).toBeTruthy();
    expect(pipAdd).toBeTruthy();
    app.unmount();
    expect(documentRemove.mock.calls.find(([name]) => name === 'keydown')?.[1]).toBe(
      keydownAdd?.[1],
    );
    expect(documentRemove.mock.calls.find(([name]) => name === 'fullscreenchange')?.[1]).toBe(
      fullscreenAdd?.[1],
    );
    expect(mediaRemove.mock.calls.find(([name]) => name === 'leavepictureinpicture')?.[1]).toBe(
      pipAdd?.[1],
    );
  });
});
