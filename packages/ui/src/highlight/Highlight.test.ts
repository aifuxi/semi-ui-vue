import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Highlight from './index';

describe('Highlight', () => {
  it('按固定默认值输出原始文本和 mark 标签', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const wrapper = mount(Highlight, {
      attachTo: host,
      props: {
        sourceString: 'From Semi Design to Any Design',
        searchWords: ['Semi Design', 'Any Design'],
      },
    });

    expect(host.textContent).toBe('From Semi Design to Any Design');
    const marks = wrapper.findAll('mark.semi-highlight-tag');
    expect(marks.map((mark) => mark.text())).toEqual(['Semi Design', 'Any Design']);
    wrapper.unmount();
    host.remove();
  });

  it('区分 autoEscape 缺省、显式 false 与显式 true', () => {
    const common = { sourceString: 'a.b axb', searchWords: ['a.b'] };
    const omitted = mount(Highlight, { props: common });
    const explicitTrue = mount(Highlight, { props: { ...common, autoEscape: true } });
    const explicitFalse = mount(Highlight, { props: { ...common, autoEscape: false } });

    expect(omitted.findAll('mark').map((node) => node.text())).toEqual(['a.b']);
    expect(explicitTrue.findAll('mark').map((node) => node.text())).toEqual(['a.b']);
    expect(explicitFalse.findAll('mark').map((node) => node.text())).toEqual(['a.b', 'axb']);
  });

  it('区分 caseSensitive 缺省、显式 false 与显式 true', () => {
    const common = { sourceString: 'Semi semi', searchWords: ['semi'] };
    const omitted = mount(Highlight, { props: common });
    const explicitFalse = mount(Highlight, { props: { ...common, caseSensitive: false } });
    const explicitTrue = mount(Highlight, { props: { ...common, caseSensitive: true } });

    expect(omitted.findAll('mark')).toHaveLength(2);
    expect(explicitFalse.findAll('mark')).toHaveLength(2);
    expect(explicitTrue.findAll('mark').map((node) => node.text())).toEqual(['semi']);
  });

  it('支持对象搜索词、class/style 合并与单词样式覆盖', () => {
    const wrapper = mount(Highlight, {
      props: {
        component: 'span',
        sourceString: 'Semi builds design systems',
        searchWords: [
          {
            text: 'Semi',
            className: 'keyword-one',
            style: { backgroundColor: 'rgb(1, 2, 3)', padding: '4px' },
          },
        ],
        highlightClassName: 'global-highlight',
        highlightStyle: { backgroundColor: 'red', borderRadius: '6px' },
      },
    });

    const tag = wrapper.get('span');
    expect(tag.classes()).toEqual(
      expect.arrayContaining(['semi-highlight-tag', 'global-highlight', 'keyword-one']),
    );
    expect(tag.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(tag.attributes('style')).toContain('border-radius: 6px');
    expect(tag.attributes('style')).toContain('padding: 4px');
  });

  it('按固定 Foundation 合并相交和相接区间', () => {
    const wrapper = mount(Highlight, {
      props: {
        sourceString: 'abcdefghi',
        searchWords: [
          { text: 'abc', className: 'first', style: { color: 'red' } },
          { text: 'cde', className: 'second', style: { backgroundColor: 'blue' } },
          { text: 'ef', className: 'third', style: { color: 'green' } },
        ],
      },
    });

    const mark = wrapper.get('mark');
    expect(wrapper.findAll('mark')).toHaveLength(1);
    expect(mark.text()).toBe('abcdef');
    expect(mark.classes()).toContain('first');
    expect(mark.attributes('style')).toContain('color: green');
    expect(mark.attributes('style')).toContain('background-color: blue');
    expect(wrapper.text()).toBe('abcdefghi');
  });

  it('过滤空搜索词，无匹配时只保留安全文本', () => {
    const wrapper = mount(Highlight, {
      props: {
        sourceString: '<script>alert(1)</script>',
        searchWords: ['', 'missing'],
      },
    });

    expect(wrapper.find('mark').exists()).toBe(false);
    expect(wrapper.find('script').exists()).toBe(false);
    expect(wrapper.text()).toBe('<script>alert(1)</script>');
  });

  it('响应 sourceString、searchWords 与 component 更新', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const wrapper = mount(Highlight, {
      attachTo: host,
      props: { sourceString: 'Semi Design', searchWords: ['Semi'] },
    });
    expect(wrapper.get('mark').text()).toBe('Semi');

    await wrapper.setProps({
      component: 'strong',
      searchWords: ['Design'],
      sourceString: 'Any Design',
    });
    expect(wrapper.find('mark').exists()).toBe(false);
    expect(wrapper.get('strong.semi-highlight-tag').text()).toBe('Design');
    expect(host.textContent).toBe('Any Design');
    wrapper.unmount();
    host.remove();
  });

  it('保持无根 wrapper 契约并忽略无落点 attrs', () => {
    const wrapper = mount(Highlight, {
      props: { sourceString: 'Semi Design', searchWords: ['Semi'] },
      attrs: { 'aria-label': 'ignored', class: 'ignored-root-class' },
    });
    expect(wrapper.html()).not.toContain('<div');
    expect(wrapper.find('[aria-label="ignored"]').exists()).toBe(false);
    expect(wrapper.find('.ignored-root-class').exists()).toBe(false);
  });
});
