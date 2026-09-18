import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Upload from './index';

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

describe('Upload hydration', () => {
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
