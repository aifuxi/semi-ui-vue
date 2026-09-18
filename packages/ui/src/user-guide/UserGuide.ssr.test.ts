import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import UserGuide from './index';

describe('UserGuide SSR', () => {
  it('does not access DOM or create a Portal while hidden', async () => {
    const popup = await renderToString(
      createSSRApp({
        render: () => h(UserGuide, { steps: [{ title: 'Popup SSR' }], visible: false }),
      }),
    );
    const modal = await renderToString(
      createSSRApp({
        render: () =>
          h(UserGuide, { mode: 'modal', steps: [{ title: 'Modal SSR' }], visible: false }),
      }),
    );
    expect(popup).not.toContain('semi-userGuide');
    expect(modal).not.toContain('semi-portal');
  });
});
