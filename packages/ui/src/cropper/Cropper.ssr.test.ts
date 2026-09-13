import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import Cropper from './Cropper.vue';

describe('Cropper SSR', () => {
  it('renders without browser globals and preserves the public DOM contract', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Cropper, {
            class: 'server-cropper',
            shape: 'round',
            src: '/photo.png',
            style: { width: '400px', height: '200px' },
          }),
      }),
    );

    expect(html).toContain('semi-cropper server-cropper');
    expect(html).toContain('semi-cropper-img-wrapper');
    expect(html).toContain('semi-cropper-mask');
    expect(html).toContain('semi-cropper-view-box-round');
    expect(html).toContain('crossorigin="anonymous"');
    expect(html).not.toContain('semi-cropper-box-corner');
  });
});
