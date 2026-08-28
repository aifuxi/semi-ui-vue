// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Avatar, { AvatarGroup } from './index';

describe('Avatar SSR', () => {
  it('输出文本、图片、装饰、Group 与 ARIA，且不读取浏览器对象', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(Avatar, { alt: 'Alice' }, () => 'AS'),
            h(Avatar, { src: '/avatar.png', alt: 'Photo' }),
            h(
              Avatar,
              {
                border: { color: 'red', motion: true },
                bottomSlot: { shape: 'circle', text: '+' },
                size: 'large',
                topSlot: { text: 'LIVE' },
              },
              () => 'L',
            ),
            h(AvatarGroup, { maxCount: 1 }, () => [
              h(Avatar, { alt: 'A' }, () => 'A'),
              h(Avatar, { alt: 'B' }, () => 'B'),
            ]),
          ]),
      }),
    );
    expect(html).toContain('semi-avatar-medium');
    expect(html).toContain('aria-label="Alice"');
    expect(html).toContain('src="/avatar.png"');
    expect(html).toContain('semi-avatar-additionalBorder-animated');
    expect(html).toContain('semi-avatar-top_slot');
    expect(html).toContain('semi-avatar-bottom_slot');
    expect(html).toContain('semi-avatar-group');
    expect(html).toContain('+1');
  });
});
