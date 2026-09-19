/**
 * 上游文档正文依赖两类 class：帖子模板自定义的 `md`（布局与字号）
 * 与上游 `semi-site-doc-style` 排版包的 `gatsby-*`（排版）。
 * 这里在 markdown-it 渲染阶段补上 class，让编译自基线的样式直接生效，不复制上游 CSS。
 *
 * 表格额外恢复基线模板的 `.table-container` 包裹层，窄屏时只滚动表格而不挤压整页。
 */
interface MarkdownToken {
  attrJoin: (name: string, value: string) => void;
  attrSet: (name: string, value: string) => void;
  content: string;
  tag: string;
}

interface MarkdownRenderer {
  renderToken: (tokens: MarkdownToken[], index: number, options: unknown) => string;
}

export interface MarkdownItLike {
  renderer: {
    rules: Record<
      string,
      | ((
          tokens: MarkdownToken[],
          index: number,
          options: unknown,
          env: unknown,
          self: MarkdownRenderer,
        ) => string)
      | undefined
    >;
  };
  core: {
    ruler: {
      push: (name: string, rule: (state: { md: MarkdownItLike }) => void) => void;
    };
  };
}

const headingClasses = [
  'gatsby-h1',
  'gatsby-h2',
  'gatsby-h3',
  'gatsby-h4',
  'gatsby-h5',
  'gatsby-h6',
];

function addClass(className: string) {
  return (
    tokens: MarkdownToken[],
    index: number,
    options: unknown,
    _env: unknown,
    self: MarkdownRenderer,
  ) => {
    tokens[index]?.attrJoin('class', className);
    return self.renderToken(tokens, index, options);
  };
}

function escapeHtml(value: string): string {
  return value.replaceAll(/[&<>"]/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      default:
        return '&quot;';
    }
  });
}

export function applyProseClasses(md: MarkdownItLike): void {
  const rules = md.renderer.rules;
  // VitePress 在 preConfig 之后覆盖 table_open；在 core 阶段恢复 vendor postTemplate.js
  // 的滚动容器，并保留可聚焦的横向滚动区域。
  md.core.ruler.push('semi-docs-table-class', (state) => {
    state.md.renderer.rules.table_open = (tokens, index, options, _env, self) => {
      tokens[index]?.attrJoin('class', 'gatsby-table');
      tokens[index]?.attrSet('tabindex', '0');
      return `<div class="table-container gatsby-table-container">${self.renderToken(tokens, index, options)}`;
    };
    state.md.renderer.rules.table_close = () => '</table></div>';
  });
  rules.heading_open = (tokens, index, options, _env, self) => {
    const token = tokens[index];
    const level = Number(token?.tag.slice(1) ?? 1);
    token?.attrJoin('class', headingClasses[level - 1] ?? 'gatsby-h6');
    token?.attrJoin('class', 'md');
    return self.renderToken(tokens, index, options);
  };
  rules.paragraph_open = addClass('gatsby-p');
  rules.bullet_list_open = addClass('gatsby-ul');
  rules.ordered_list_open = addClass('gatsby-ol');
  rules.blockquote_open = addClass('gatsby-blockquote');
  rules.strong_open = addClass('gatsby-strong');
  rules.em_open = addClass('gatsby-em');
  rules.hr = () => '<hr class="gatsby-hr">';
  rules.code_inline = (tokens, index) =>
    `<code class="gatsby-code">${escapeHtml(tokens[index]?.content ?? '')}</code>`;
}
