import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Upload from './Upload.vue';

const files = [
  { uid: 'a', name: 'alpha.txt', size: '1.0KB', status: 'success' as const },
  {
    uid: 'b',
    name: 'beta.png',
    size: '2.0KB',
    status: 'uploadFail' as const,
    preview: true,
    url: '/beta.png',
  },
];

describe('Upload SSR', () => {
  it('无 browser global 时输出 list、隐藏 inputs、data/style 与 ARIA', async () => {
    const html = await renderToString(
      h(
        Upload,
        {
          action: '/upload',
          className: 'ssr-upload',
          defaultFileList: files,
          'data-kind': 'ssr',
          style: { width: '320px' },
        },
        () => h('button', 'Select'),
      ),
    );
    expect(html).toContain('semi-upload ssr-upload');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('width:320px');
    expect(html).toContain('semi-upload-hidden-input');
    expect(html).toContain('aria-label="file list"');
    expect(html).toContain('role="listitem"');
    expect(html).toContain('alpha.txt');
  });

  it('输出 picture/none、disabled/validation、locale/RTL 与受控列表', async () => {
    const picture = await renderToString(
      h(Upload, { action: '/upload', disabled: true, fileList: files, listType: 'picture' }),
    );
    expect(picture).toContain('semi-upload-picture');
    expect(picture).toContain('semi-upload-disabled');
    expect(picture).toContain('aria-label="picture list"');

    const none = await renderToString(
      h(Upload, {
        action: '/upload',
        fileList: files,
        listType: 'none',
        validateMessage: 'SSR invalid',
        validateStatus: 'error',
      }),
    );
    expect(none).toContain('semi-upload-error');
    expect(none).toContain('SSR invalid');
    expect(none).not.toContain('role="listitem"');

    const localized = await renderToString(
      h(
        ConfigProvider,
        {
          direction: 'rtl',
          locale: {
            code: 'en-US',
            Upload: { selectedFiles: 'SSR selected', clear: 'SSR clear' },
          },
        },
        () => h(Upload, { action: '/upload', defaultFileList: files }),
      ),
    );
    expect(localized).toContain('semi-rtl');
    expect(localized).toContain('SSR selected');
    expect(localized).toContain('SSR clear');
  });

  it('hydration 无警告并保留受控 DOM', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Upload, { action: '/upload', fileList: files }) };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelectorAll('.semi-upload-file-card')).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
