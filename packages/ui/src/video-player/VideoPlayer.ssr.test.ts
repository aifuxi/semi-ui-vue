import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import VideoPlayer from './VideoPlayer.vue';

describe('VideoPlayer SSR', () => {
  it('服务端渲染静态 video/poster/progress/controls 且无媒体或全局副作用', async () => {
    expect(typeof document).toBe('undefined');
    expect(typeof HTMLMediaElement).toBe('undefined');

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
  });

  it('显式 clickToPlay=false 和 controlsList 在 SSR 保留公开 DOM 契约', async () => {
    const html = await renderToString(
      h(VideoPlayer, { src: '/video.mp4', clickToPlay: false, controlsList: ['play', 'time'] }),
    );
    expect(html).toContain('semi-videoPlayer-controls-time');
    expect(html).not.toContain('semi-videoPlayer-controls-popup');
    expect(html.match(/semi-videoPlayer-controls-menu-button/g)).toHaveLength(1);
  });
});
