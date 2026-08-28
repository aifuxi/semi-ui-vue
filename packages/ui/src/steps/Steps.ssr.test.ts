import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Step from './Step.vue';
import Steps from './Steps.vue';

function render(type: 'fill' | 'basic' | 'nav') {
  return renderToString(
    createSSRApp(
      defineComponent({
        setup: () => () =>
          h(
            Steps,
            { current: 1, type, 'aria-label': `${type} progress` },
            {
              default: () => [
                h(Step, { title: 'Finished', description: 'Done' }),
                h(Step, { title: 'Current', description: 'Working' }),
                h(Step, { title: 'Waiting', description: 'Later' }),
              ],
            },
          ),
      }),
    ),
  );
}

describe('Steps SSR', () => {
  it('稳定渲染 fill/basic/nav 而不访问 DOM', async () => {
    const fill = await render('fill');
    expect(fill).toContain('class="semi-steps semi-steps-horizontal"');
    expect(fill).toContain('class="semi-row-flex semi-row-flex-start"');
    expect(fill).toContain('style="width:33.333333333333336%;"');
    expect(fill).toContain('semi-steps-item-process');

    const basic = await render('basic');
    expect(basic).toContain('semi-steps-basic');
    expect(basic).toContain('semi-steps-hasline');
    expect(basic).toContain('semi-steps-item-number-icon');

    const nav = await render('nav');
    expect(nav).toContain('semi-steps-nav');
    expect(nav.match(/semi-icon-chevron_right/g)).toHaveLength(2);
  });
});
