import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import { ArrayField, Form, type ArrayFieldSlotProps } from './index';

describe('Form SSR', () => {
  it('暂缓仅由 ArrayField.initValue 提供的行，仍服务端渲染 Form.initValues 中的行', async () => {
    const row = ({ arrayFields }: ArrayFieldSlotProps) =>
      arrayFields.map(({ field, key }) => h(Form.Input, { field, key }));
    const html = await renderToString(
      h(Form, { initValues: { loaded: ['from-form'] } }, () => [
        h(ArrayField, { field: 'deferred', initValue: ['from-array-field'] }, { default: row }),
        h(ArrayField, { field: 'loaded' }, { default: row }),
      ]),
    );

    expect(html).not.toContain('from-array-field');
    expect(html).toContain('value="from-form"');
  });

  it('renders the form, field label, control and required ARIA without browser globals', async () => {
    const html = await renderToString(
      h(Form, { initValues: { name: 'semi' } }, () =>
        h(Form.Input, {
          field: 'name',
          label: 'Name',
          rules: [{ required: true }],
        }),
      ),
    );
    expect(html).toContain('semi-form-vertical');
    expect(html).toContain('semi-form-field-label-required');
    expect(html).toContain('aria-required="true"');
    expect(html).toContain('value="semi"');
  });

  it('renders horizontal and inset field structures', async () => {
    const html = await renderToString(
      h(Form, { layout: 'horizontal' }, () => [
        h(Form.Input, { field: 'plain', label: 'Plain' }),
        h(Form.Input, { field: 'inset', label: 'Inset', labelPosition: 'inset' }),
      ]),
    );
    expect(html).toContain('semi-form-horizontal');
    expect(html).toContain('x-label-pos="top"');
    expect(html).toContain('x-label-pos="inset"');
  });
});
