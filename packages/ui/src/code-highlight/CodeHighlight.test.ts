/* eslint-disable vue/one-component-per-file -- template and render hosts verify Boolean prop presence. */
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { semiGlobal } from '../config-provider';
import CodeHighlight from './CodeHighlight.vue';

const javascriptCode = ['const answer = 42;', 'console.log(answer);'].join('\n');

afterEach(() => {
  delete semiGlobal.config.overrideDefaultProps;
});

describe('CodeHighlight', () => {
  it('缺省 Boolean 使用固定 true 默认值并生成 Prism token 与行号', () => {
    const wrapper = mount(CodeHighlight, {
      props: { code: javascriptCode, language: 'javascript' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-codeHighlight',
        'semi-light-scrollbar',
        'semi-codeHighlight-defaultTheme',
      ]),
    );
    expect(wrapper.get('pre').classes()).toEqual(
      expect.arrayContaining(['language-javascript', 'line-numbers']),
    );
    expect(wrapper.get('code').classes()).toContain('language-javascript');
    expect(wrapper.find('.token.keyword').text()).toBe('const');
    expect(wrapper.findAll('.line-numbers-rows > span')).toHaveLength(2);
  });

  it('SFC 模板裸 Boolean 与显式 false 分别覆盖 defaultTheme/lineNumber', () => {
    const Host = defineComponent({
      components: { CodeHighlight },
      data: () => ({ javascriptCode }),
      template: `
        <section>
          <CodeHighlight
            data-kind="false"
            :code="javascriptCode"
            language="javascript"
            :default-theme="false"
            :line-number="false"
          />
          <CodeHighlight
            data-kind="true"
            :code="javascriptCode"
            language="javascript"
            default-theme
            line-number
          />
        </section>
      `,
    });
    const wrapper = mount(Host);
    const disabled = wrapper.get('[data-kind="false"]');
    const enabled = wrapper.get('[data-kind="true"]');

    expect(disabled.classes()).not.toContain('semi-codeHighlight-defaultTheme');
    expect(disabled.get('pre').classes()).not.toContain('line-numbers');
    expect(disabled.find('.line-numbers-rows').exists()).toBe(false);
    expect(enabled.classes()).toContain('semi-codeHighlight-defaultTheme');
    expect(enabled.get('pre').classes()).toContain('line-numbers');
  });

  it('h() 显式 true 优先于全局 false，缺省采用全局默认值', () => {
    semiGlobal.config.overrideDefaultProps = {
      CodeHighlight: { defaultTheme: false, lineNumber: false },
    };
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('section', [
            h(CodeHighlight, {
              code: javascriptCode,
              language: 'javascript',
              'data-kind': 'global',
            }),
            h(CodeHighlight, {
              code: javascriptCode,
              defaultTheme: true,
              language: 'javascript',
              lineNumber: true,
              'data-kind': 'explicit',
            }),
          ]),
      }),
    );

    expect(wrapper.get('[data-kind="global"]').classes()).not.toContain(
      'semi-codeHighlight-defaultTheme',
    );
    expect(wrapper.get('[data-kind="global"] pre').classes()).not.toContain('line-numbers');
    expect(wrapper.get('[data-kind="explicit"]').classes()).toContain(
      'semi-codeHighlight-defaultTheme',
    );
    expect(wrapper.get('[data-kind="explicit"] pre').classes()).toContain('line-numbers');
  });

  it('code 变化重新高亮；language/lineNumber-only 变化保持固定 Adapter 更新语义', async () => {
    const wrapper = mount(CodeHighlight, {
      props: { code: 'const before = 1;', language: 'javascript' },
    });
    expect(wrapper.find('.token.keyword').text()).toBe('const');
    expect(wrapper.findAll('.line-numbers-rows > span')).toHaveLength(1);

    await wrapper.setProps({ code: ['let after = 2;', 'after += 1;'].join('\n') });
    expect(wrapper.find('.token.keyword').text()).toBe('let');
    expect(wrapper.findAll('.line-numbers-rows > span')).toHaveLength(2);

    const highlightedHtml = wrapper.get('code').html();
    await wrapper.setProps({ language: 'css', lineNumber: false });
    expect(wrapper.get('code').classes()).toContain('language-javascript');
    expect(wrapper.get('code').classes()).not.toContain('language-css');
    expect(wrapper.get('code').html()).toBe(highlightedHtml);
    expect(wrapper.get('pre').classes()).toContain('line-numbers');
  });

  it('CSS 语言、class/style/data attrs 与 HTML 文本转义保持固定 DOM', () => {
    const css = mount(CodeHighlight, {
      props: {
        class: 'native-class',
        className: 'react-class',
        code: '.box { color: red; }',
        language: 'css',
        lineNumber: false,
        style: { width: '320px' },
      },
      attrs: { 'aria-label': '不会透传', 'data-kind': 'css' },
    });
    expect(css.classes()).toEqual(
      expect.arrayContaining(['semi-codeHighlight', 'native-class', 'react-class']),
    );
    expect((css.element as HTMLElement).style.width).toBe('320px');
    expect(css.attributes('data-kind')).toBe('css');
    expect(css.attributes('aria-label')).toBeUndefined();
    expect(css.find('.token.selector').text()).toBe('.box');

    const markup = mount(CodeHighlight, {
      props: {
        code: '<img src=x onerror="unsafe()">',
        language: 'markup',
        lineNumber: false,
      },
    });
    expect(markup.find('img').exists()).toBe(false);
    expect(markup.find('.token.tag').text()).toContain('<img');
    expect(markup.text()).toContain('<img src=x onerror="unsafe()">');
  });
});
