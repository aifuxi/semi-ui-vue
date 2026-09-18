import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import AudioPlayer from './index';

describe('AudioPlayer SSR', () => {
  it('服务端渲染静态 audio/control/info/toolbar 且无媒体副作用', async () => {
    expect(typeof document).toBe('undefined');
    expect(typeof HTMLMediaElement).toBe('undefined');

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
  });

  it('显式 showToolbar=false 的服务端 DOM 不渲染工具栏', async () => {
    const html = await renderToString(
      h(AudioPlayer, { audioUrl: '/audio.mp3', showToolbar: false }),
    );
    expect(html).not.toContain('semi-audio-player-control-speed');
    expect(html.match(/semi-audio-player-control/g)).toHaveLength(2);
  });
});
