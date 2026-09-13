import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { DatePicker } from './index';

describe('DatePicker SSR', () => {
  it('imports and renders a default trigger without browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(DatePicker, { defaultValue: new Date(2024, 4, 10) }),
      }),
    );
    expect(html).toContain('semi-datepicker');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('2024-05-10');
    expect(html).toContain('semi-icon-calendar');
    expect(html).not.toContain('semi-datepicker-month-grid');
  });

  it('renders the range input structure and custom trigger safely', async () => {
    const rangeHtml = await renderToString(
      createSSRApp({
        render: () =>
          h(DatePicker, {
            type: 'dateRange',
            defaultValue: [new Date(2024, 4, 10), new Date(2024, 4, 12)],
          }),
      }),
    );
    expect(rangeHtml).toContain('semi-datepicker-range-input-wrapper-start');
    expect(rangeHtml).toContain('semi-datepicker-range-input-wrapper-end');
    expect(rangeHtml).toContain('2024-05-10');
    expect(rangeHtml).toContain('2024-05-12');

    const triggerHtml = await renderToString(
      createSSRApp({
        render: () => h(DatePicker, { triggerRender: () => h('button', 'Choose') }),
      }),
    );
    expect(triggerHtml).toContain('<button>Choose</button>');
  });
});
