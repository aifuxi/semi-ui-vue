import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import Feedback from './index';

describe('Feedback SSR', () => {
  it('不可见 popup/modal 都不在服务端创建 Portal 或访问 DOM', async () => {
    const popup = await renderToString(
      createSSRApp({ render: () => h(Feedback, { title: 'Popup SSR', visible: false }) }),
    );
    const modal = await renderToString(
      createSSRApp({
        render: () => h(Feedback, { mode: 'modal', title: 'Modal SSR', visible: false }),
      }),
    );
    expect(popup).not.toContain('semi-portal');
    expect(popup).not.toContain('Popup SSR');
    expect(modal).not.toContain('semi-portal');
    expect(modal).not.toContain('Modal SSR');
  });
});
