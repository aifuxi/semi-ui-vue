/**
 * 上游文档正文依赖两类 class：帖子模板自定义的 `md`（布局与字号）
 * 与上游 `semi-site-doc-style` 排版包的 `gatsby-*`（排版）。
 * 这里在 markdown-it 渲染阶段补上 class，让编译自基线的样式直接生效，不复制上游 CSS。
 *
 * 只用 VitePress 不会覆盖的 renderer 规则：表格由 `table_open` 被 VitePress 固定为
 * `<table tabindex="0">`，改由 `.vitepress/config.ts` 的 Vite 插件补齐。
 */
interface MarkdownToken {
  attrJoin: (name: string, value: string) => void;
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
  // VitePress 在 preConfig 之后把 table_open 固定成 `<table tabindex="0">`，会丢掉 token 属性。
  // 这里在 core 阶段（渲染之前）把它换回带 class 的渲染，保证表格拿到基线 prose 表样式。
  md.core.ruler.push('semi-docs-table-class', (state) => {
    state.md.renderer.rules.table_open = (tokens, index, options, _env, self) => {
      tokens[index]?.attrJoin('class', 'gatsby-table');
      return self.renderToken(tokens, index, options);
    };
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
