import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { pinnedLocale_zh_CN } from '@workspace/foundation-integration';
import { ConfigConsumer, ConfigProvider, type ConfigContextValue } from './index';
import { DatePicker } from '../date-picker';

describe('ConfigProvider documentation regressions', () => {
  it('publishes the complete pinned default locale through Consumer on client and SSR', async () => {
    const content = () =>
      h(ConfigConsumer, null, {
        default: (context: ConfigContextValue) => h('pre', JSON.stringify(context.locale)),
      });
    const wrapper = mount(ConfigProvider, { slots: { default: content } });
    expect(JSON.parse(wrapper.get('pre').text())).toEqual(
      JSON.parse(JSON.stringify(pinnedLocale_zh_CN)),
    );
    wrapper.unmount();
    const html = await renderToString(
      createSSRApp({ render: () => h(ConfigProvider, null, content) }),
    );
    expect(html).toContain('dateFnsLocale');
    expect(html).toContain('AIChatInput');
  });
  for (const inputReadOnly of [undefined, false, true])
    it(`keeps the DatePicker readonly class consistent with inputReadOnly=${inputReadOnly}`, () => {
      const wrapper = mount(DatePicker, {
        props: inputReadOnly === undefined ? {} : { inputReadOnly },
      });
      expect(
        wrapper.get('.semi-input-wrapper').classes().includes('semi-datepicker-input-readonly'),
      ).toBe(inputReadOnly === true);
      expect(wrapper.get('input').element.readOnly).toBe(inputReadOnly === true);
      wrapper.unmount();
    });
});
