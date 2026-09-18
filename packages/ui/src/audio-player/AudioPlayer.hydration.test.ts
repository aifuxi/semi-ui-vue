import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import AudioPlayer from './index';

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('AudioPlayer hydration', () => {
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
