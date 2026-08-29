import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import Banner from './index';

describe('Banner SSR', () => {
  it('无 DOM 环境输出默认 alert、图标、标题、描述、额外内容与关闭按钮', async () => {
    const html = await renderToString(
      h(
        Banner,
        {
          'aria-label': '版本通知',
          'data-probe': 'banner',
          description: '新版本已经可用',
          title: '版本提示',
        },
        { default: () => h('button', '立即查看') },
      ),
    );

    expect(html).toContain('class="semi-banner semi-banner-info semi-banner-full"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-label="版本通知"');
    expect(html).toContain('data-probe="banner"');
    expect(html).toContain('semi-icon-info_circle');
    expect(html).toContain('aria-label="info"');
    expect(html).toContain('semi-banner-title');
    expect(html).toContain('版本提示');
    expect(html).toContain('semi-banner-description');
    expect(html).toContain('新版本已经可用');
    expect(html).toContain('semi-banner-extra');
    expect(html).toContain('<button>立即查看</button>');
    expect(html).toContain('aria-label="Close"');
  });

  it('容器模式、边框和 null 图标在 SSR 中保持固定分支', async () => {
    const html = await renderToString(
      h(Banner, {
        bordered: true,
        closeIcon: null,
        description: '容器通知',
        fullMode: false,
        icon: null,
        type: 'warning',
      }),
    );
    expect(html).toContain(
      'class="semi-banner semi-banner-warning semi-banner-in-container semi-banner-bordered"',
    );
    expect(html).not.toContain('semi-banner-icon');
    expect(html).not.toContain('semi-banner-close');
  });
});
