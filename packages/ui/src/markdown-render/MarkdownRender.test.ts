/* eslint-disable vue/one-component-per-file -- local black-box fixtures stay beside the test */
import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import { semiGlobal } from '../config-provider';
import { MarkdownRender, markdownRenderDefaultComponents } from './index';

async function waitFor(wrapper: VueWrapper, selector: string, maximumAttempts = 30): Promise<void> {
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    if (wrapper.find(selector).exists()) return;
  }
  throw new Error(`等待 ${selector} 渲染超时：${wrapper.html()}`);
}

afterEach(() => {
  delete semiGlobal.config.overrideDefaultProps;
});

describe('MarkdownRender', () => {
  it('异步渲染 Markdown、默认 Typography、链接和行内代码', async () => {
    const wrapper = mount(MarkdownRender, {
      props: {
        raw: '# 标题\n\n[链接](https://semi.design) 和 `const value = 1`',
      },
    });

    expect(wrapper.classes()).toContain('semi-markdownRender');
    expect(wrapper.find('h1').exists()).toBe(false);
    await waitFor(wrapper, 'h1');

    expect(wrapper.get('h1').classes()).toContain('semi-markdownRender-component-header');
    expect(wrapper.get('a').attributes('href')).toBe('https://semi.design');
    expect(wrapper.get('.semi-markdownRender-simple-code').text()).toBe('const value = 1');
  });

  it('默认开启 GFM 并覆盖普通、仅表头和单列表格', async () => {
    const wrapper = mount(MarkdownRender, {
      props: {
        raw: '| 名称 | **数量** |\n| - | -: |\n| 书 | 10 |\n| 笔 | 20 |',
      },
    });
    await waitFor(wrapper, '.semi-table-container');
    expect(wrapper.findAll('.semi-table-tbody .semi-table-row')).toHaveLength(2);
    expect(wrapper.text()).toContain('数量');
    expect(wrapper.text()).toContain('20');

    await wrapper.setProps({ raw: '| 标题 |\n| - |' });
    await waitFor(wrapper, '.semi-table-container');
    expect(wrapper.text()).toContain('标题');

    await wrapper.setProps({ raw: '| 标题 |\n| - |\n| 内容 |' });
    await waitFor(wrapper, '.semi-table-container');
    expect(wrapper.text()).toContain('内容');
  });

  it('区分 remarkGfm 缺省、显式 false、显式 true 和全局覆盖', async () => {
    const table = '| A |\n| - |\n| B |';
    const implicit = mount(MarkdownRender, { props: { raw: table } });
    await waitFor(implicit, '.semi-table-container');

    const disabled = mount(MarkdownRender, { props: { raw: table, remarkGfm: false } });
    await waitFor(disabled, 'p');
    expect(disabled.find('.semi-table-container').exists()).toBe(false);

    semiGlobal.config.overrideDefaultProps = { MarkdownRender: { remarkGfm: false } };
    const globalDisabled = mount(MarkdownRender, { props: { raw: table } });
    await waitFor(globalDisabled, 'p');
    expect(globalDisabled.find('.semi-table-container').exists()).toBe(false);

    const explicit = mount(MarkdownRender, { props: { raw: table, remarkGfm: true } });
    await waitFor(explicit, '.semi-table-container');
  });

  it('支持纯 Markdown、调用方组件覆盖和 MDX 事件', async () => {
    const CustomHeading = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs, slots }) {
        return () => h('h2', { ...attrs, class: 'custom-heading' }, slots.default?.());
      },
    });
    const CustomButton = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs, slots }) {
        return () => h('button', attrs, slots.default?.());
      },
    });
    const wrapper = mount(MarkdownRender, {
      props: {
        raw: '## 自定义\n\n<CustomButton onClick={() => globalThis.__markdownRenderClicks = (globalThis.__markdownRenderClicks || 0) + 1}>点击</CustomButton>',
        components: { h2: CustomHeading, CustomButton },
      },
    });
    await waitFor(wrapper, 'button');
    await wrapper.get('button').trigger('click');
    expect(
      (globalThis as typeof globalThis & { __markdownRenderClicks?: number })
        .__markdownRenderClicks,
    ).toBe(1);
    delete (globalThis as typeof globalThis & { __markdownRenderClicks?: number })
      .__markdownRenderClicks;
    expect(wrapper.get('.custom-heading').text()).toBe('自定义');

    const markdownOnly = mount(MarkdownRender, {
      props: { raw: '无需转义的符号{}<>', format: 'md' },
    });
    await waitFor(markdownOnly, 'p');
    expect(markdownOnly.text()).toContain('无需转义的符号{}<>');
  });

  it('raw 更新只提交最新求值结果并合并根属性', async () => {
    const wrapper = mount(MarkdownRender, {
      attrs: { class: 'from-attrs', 'data-case': 'update' },
      props: {
        raw: '# 旧内容',
        className: 'from-prop',
        style: { color: 'rgb(1, 2, 3)' },
      },
    });
    await wrapper.setProps({ raw: '# 新内容' });
    await waitFor(wrapper, 'h1');
    expect(wrapper.get('h1').text()).toBe('新内容');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-markdownRender', 'from-attrs', 'from-prop']),
    );
    expect(wrapper.attributes('data-case')).toBe('update');
    expect(wrapper.attributes('style')).toContain('color: rgb(1, 2, 3)');
  });

  it('公开默认组件静态字段', () => {
    expect(MarkdownRender.defaultComponents).toBe(markdownRenderDefaultComponents);
    expect(Object.keys(MarkdownRender.defaultComponents)).toEqual([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'a',
      'img',
      'table',
      'p',
      'code',
    ]);
  });
});
