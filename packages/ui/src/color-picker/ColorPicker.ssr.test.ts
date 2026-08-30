import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { ColorPicker, colorStringToValue } from './index';

describe('ColorPicker SSR', () => {
  it('imports and renders inline mode without browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(ColorPicker, {
            defaultValue: colorStringToValue('#33669980'),
            alpha: true,
            eyeDropper: false,
            width: 220,
            height: 120,
          }),
      }),
    );
    expect(html).toContain('semi-colorPicker');
    expect(html).toContain('semi-colorPicker-colorChooseArea');
    expect(html).toContain('aria-label="Alpha"');
    expect(html).toContain('width:220px');
    expect(html).not.toContain('semi-icon-eyedropper');
  });

  it('renders only the trigger in Popover mode', async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(ColorPicker, { usePopover: true }) }),
    );
    expect(html).toContain('semi-colorPicker-popover-defaultChildren');
    expect(html).not.toContain('semi-colorPicker-colorChooseArea');
  });
});
