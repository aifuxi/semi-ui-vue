import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AudioPlayer from './AudioPlayer.vue';

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('AudioPlayer SSR', () => {
  it('服务端渲染静态 audio/control/info/toolbar 且无媒体副作用', async () => {
    const add = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const html = await renderToString(
      h(AudioPlayer, {
        audioUrl: { src: '/audio.mp3', title: 'SSR track' },
        className: 'ssr-player',
      }),
    );

    expect(html).toContain('semi-audio-player-dark');
    expect(html).toContain('ssr-player');
    expect(html).toContain('<audio');
    expect(html).toContain('<track kind="captions" src="/audio.mp3">');
    expect(html).toContain('SSR track');
    expect(html).toContain('semi-audio-player-control-speed');
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(add).not.toHaveBeenCalled();
  });

  it('显式 showToolbar=false 的服务端 DOM 不渲染工具栏', async () => {
    const html = await renderToString(
      h(AudioPlayer, { audioUrl: '/audio.mp3', showToolbar: false }),
    );
    expect(html).not.toContain('semi-audio-player-control-speed');
    expect(html.match(/semi-audio-player-control/g)).toHaveLength(2);
  });

  it('hydration 后注册一组监听并在卸载时以相同引用清理', async () => {
    const add = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const remove = vi.spyOn(HTMLMediaElement.prototype, 'removeEventListener');
    const Host = { render: () => h(AudioPlayer, { audioUrl: '/audio.mp3' }) };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();

    const mediaAdds = add.mock.calls.filter(([name]) =>
      ['loadedmetadata', 'error', 'ended'].includes(String(name)),
    );
    expect(mediaAdds).toHaveLength(3);
    app.unmount();
    const mediaRemoves = remove.mock.calls.filter(([name]) =>
      ['loadedmetadata', 'error', 'ended'].includes(String(name)),
    );
    expect(mediaRemoves).toHaveLength(3);
    for (const [index, addCall] of mediaAdds.entries()) {
      expect(mediaRemoves[index]?.[0]).toBe(addCall[0]);
      expect(mediaRemoves[index]?.[1]).toBe(addCall[1]);
    }
  });
});
