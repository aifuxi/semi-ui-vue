import { flushPromises, mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, provide } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Typography, {
  EN_US_TYPOGRAPHY_LOCALE,
  Numeral,
  Paragraph,
  Text,
  Title,
  typographyLocaleKey,
} from './index';

describe('Typography', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => true),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('渲染聚合根节点并透传原生 attrs', () => {
    const wrapper = mount(Typography, {
      props: { component: 'section' },
      attrs: { id: 'article', class: 'custom' },
      slots: { default: 'Semi Design' },
    });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-typography', 'custom']));
    expect(wrapper.attributes('id')).toBe('article');
  });

  it('Title 保留 heading、component、类型和字重契约', () => {
    const wrapper = mount(Title, {
      props: { heading: 3, type: 'warning', weight: 'semibold' },
      slots: { default: 'Heading' },
    });
    expect(wrapper.element.tagName).toBe('H3');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-typography',
        'semi-typography-warning',
        'semi-typography-h3',
        'semi-typography-h3-weight-semibold',
      ]),
    );

    const custom = mount(Title, {
      props: { component: 'div', heading: 2, weight: 700 },
      slots: { default: 'Custom' },
    });
    expect(custom.element.tagName).toBe('DIV');
    expect(custom.classes()).toContain('semi-typography-h2');
    expect((custom.element as HTMLElement).style.fontWeight).toBe('700');
  });

  it('Text 按固定顺序组合 icon、mark、code、underline、strong 与 delete', () => {
    const wrapper = mount(Text, {
      props: { mark: true, code: true, underline: true, strong: true, delete: true },
      slots: {
        icon: '<i data-testid="icon">I</i>',
        default: 'Decorated',
      },
    });
    expect(wrapper.find('[x-semi-prop="icon"]').exists()).toBe(true);
    expect(wrapper.find('del > strong > u > code > mark').text()).toContain('Decorated');
  });

  it('link 对象透传到内部 a，disabled 时降级为 span', async () => {
    const wrapper = mount(Text, {
      props: { link: { href: 'https://semi.design/' }, underline: true },
      slots: { default: 'Link' },
    });
    expect(wrapper.get('a').attributes('href')).toBe('https://semi.design/');
    expect(wrapper.get('.semi-typography-link-text').classes()).toContain(
      'semi-typography-link-underline',
    );
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.classes()).toContain('semi-typography-disabled');
  });

  it('Paragraph 保留段落 class、尺寸与扩展行距', () => {
    const wrapper = mount(Paragraph, {
      props: { size: 'small', spacing: 'extended' },
      slots: { default: 'Paragraph' },
    });
    expect(wrapper.element.tagName).toBe('P');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-typography-paragraph',
        'semi-typography-small',
        'semi-typography-extended',
      ]),
    );
  });

  it('size=inherit 响应父级 Typography 尺寸变化', async () => {
    const wrapper = mount(Text, {
      props: { size: 'small' },
      slots: {
        default: () => h(Text, { class: 'child', size: 'inherit' }, () => 'Inherited'),
      },
    });
    expect(wrapper.get('.child').classes()).toContain('semi-typography-small');
    await wrapper.setProps({ size: 'normal' });
    expect(wrapper.get('.child').classes()).toContain('semi-typography-normal');
    expect(wrapper.get('.child').classes()).not.toContain('semi-typography-small');
  });

  it('Numeral 深度格式化文本与元素子节点，并支持 parser', async () => {
    const wrapper = mount(Numeral, {
      props: { rule: 'numbers', truncate: 'ceil', precision: 2 },
      slots: {
        default: () =>
          h('div', { class: 'price' }, [
            h('span', null, '预期价格:1.555; 成本:-1; 盈利:0.555'),
            h('b', null, ' Currency symbols: $'),
          ]),
      },
    });
    expect(wrapper.get('.price').text()).toBe('1.56,-1.00,0.56');
    await wrapper.setProps({ parser: (value: string) => value.replace(/[^\d.]/g, '') });
    expect(wrapper.get('.price').text()).toBe('1.55510.555');
  });

  it.each([
    ['text', 'File 1536.00 and 0.13'],
    ['numbers', '1536.00,0.13'],
    ['bytes-decimal', 'File 1.54 KB and 0.13 B'],
    ['bytes-binary', 'File 1.50 KiB and 0.13 B'],
    ['percentages', 'File 153600.00% and 12.50%'],
    ['exponential', 'File 1.54e+3 and 1.25e-1'],
  ] as const)('Numeral 支持 %s 规则', (rule, expected) => {
    const wrapper = mount(Numeral, {
      props: { rule, precision: 2 },
      slots: { default: 'File 1536 and 0.125' },
    });
    expect(wrapper.text()).toBe(expected);
  });

  it.each([
    ['ceil', '1.56'],
    ['floor', '1.55'],
    ['round', '1.56'],
  ] as const)('Numeral 支持 %s 截取模式', (truncate, expected) => {
    const wrapper = mount(Numeral, {
      props: { rule: 'text', precision: 2, truncate },
      slots: { default: '1.555' },
    });
    expect(wrapper.text()).toBe(expected);
  });

  it('copyable 复制显式内容、回调、成功状态和计时复位', async () => {
    vi.useFakeTimers();
    const onCopy = vi.fn();
    const wrapper = mount(Text, {
      props: { copyable: { content: 'copy me', duration: 1, onCopy } },
      slots: { default: 'Visible text' },
    });
    await wrapper.get('[role="button"]').trigger('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(onCopy).toHaveBeenCalledWith(expect.any(MouseEvent), 'copy me', true);
    expect(wrapper.emitted('copy')?.[0]?.slice(1)).toEqual(['copy me', true]);
    expect(wrapper.find('.semi-typography-action-copied').text()).toContain('复制成功');
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.find('.semi-typography-action-copy').exists()).toBe(true);
  });

  it('copyable 自定义 icon prop 与 copyIcon slot 保持可键盘触发', async () => {
    const customIcon = mount(Text, {
      props: { copyable: { icon: h('span', { class: 'custom-copy-icon' }, 'C') } },
      slots: { default: 'Custom icon' },
    });
    const icon = customIcon.get('.custom-copy-icon');
    expect(icon.attributes('role')).toBe('button');
    await icon.trigger('keydown', { key: 'Enter' });
    expect(customIcon.emitted('copy')).toHaveLength(1);

    const slotIcon = mount(Text, {
      props: { copyable: true },
      slots: {
        default: 'Slot icon',
        copyIcon: '<span class="slot-copy-icon">S</span>',
      },
    });
    await slotIcon.get('.semi-typography-action-copy-icon').trigger('click');
    expect(slotIcon.emitted('copy')).toHaveLength(1);
  });

  it('从注入 locale 读取复制和展开文案', async () => {
    // eslint-disable-next-line vue/one-component-per-file
    const Host = defineComponent({
      setup() {
        provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
        return () => h(Text, { copyable: true }, () => 'English');
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe('Copy');
  });

  it('CSS ellipsis 输出固定 class，多行输出 line clamp', () => {
    const single = mount(Text, {
      props: { ellipsis: true },
      attrs: { style: 'width: 80px' },
      slots: { default: 'Long text' },
    });
    expect(single.classes()).toEqual(
      expect.arrayContaining([
        'semi-typography-ellipsis-single-line',
        'semi-typography-ellipsis-overflow-ellipsis',
        'semi-typography-ellipsis-overflow-ellipsis-text',
      ]),
    );

    const multiple = mount(Paragraph, {
      props: { ellipsis: { rows: 2 } },
      slots: { default: 'Long paragraph' },
    });
    expect((multiple.element as HTMLElement).style.webkitLineClamp).toBe('2');
  });

  it('JS ellipsis 公开展开按钮并按点击与 Enter 发出 expand', async () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: {
          rows: 1,
          expandable: true,
          collapsible: true,
          expandText: '展开',
          collapseText: '收起',
        },
      },
      slots: { default: 'A very long typography paragraph for truncation' },
    });
    await nextTick();
    await flushPromises();
    const action = wrapper.get('.semi-typography-ellipsis-expand');
    await action.trigger('click');
    expect(wrapper.emitted('expand')?.[0]?.[0]).toBe(true);
    expect(action.text()).toBe('收起');
    await action.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('expand')?.[1]?.[0]).toBe(false);
  });

  it('四个公开组件均可 SSR-safe import/render', async () => {
    const app = createSSRApp(
      // eslint-disable-next-line vue/one-component-per-file
      defineComponent({
        setup: () => () =>
          h(Typography, null, {
            default: () => [
              h(Title, { heading: 2 }, () => 'Title'),
              h(Text, { strong: true }, () => 'Text'),
              h(Paragraph, null, () => 'Paragraph'),
              h(Numeral, { rule: 'percentages', precision: 1 }, () => '0.125'),
            ],
          }),
      }),
    );
    const html = await renderToString(app);
    expect(html).toContain('<article class="semi-typography">');
    expect(html).toContain('12.5%');
    expect(html).not.toContain('data-v-app');
  });
});
