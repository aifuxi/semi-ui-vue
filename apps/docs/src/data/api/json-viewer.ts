import { apiItem as p } from './helpers';
import type { ApiSection } from './types';

export const jsonViewerApi: readonly ApiSection[] = [
  {
    id: 'json-viewer-props',
    title: { 'zh-CN': 'JsonViewer Props', 'en-US': 'JsonViewer props' },
    kind: 'props',
    items: [
      p(
        'value',
        'string',
        "''",
        'JSON 文本，支持 v-model:value。',
        'JSON source with v-model:value.',
      ),
      p('width / height', 'number | string', '400', '编辑器尺寸。', 'Editor dimensions.'),
      p('showSearch', 'boolean', 'true', '显示搜索入口。', 'Shows the search entry.'),
      p(
        'options',
        'JsonViewerOptions',
        '{ readOnly: false, autoWrap: true }',
        '只读、换行、格式化、补全与 token 渲染。',
        'Read-only, wrapping, formatting, completion, and token rendering.',
      ),
      p(
        'limitSearchButtonBounds',
        'boolean',
        'false',
        '限制搜索入口拖动范围。',
        'Constrains the draggable search control.',
      ),
      p(
        'renderSearchButton',
        '(node, controls) => VNodeChild',
        '—',
        '自定义搜索入口。',
        'Custom search entry.',
      ),
      p(
        'renderTooltip',
        '(value, element) => HTMLElement',
        '—',
        'v2.102.0 兼容属性。',
        'v2.102.0 compatibility prop.',
      ),
      p('class / className / style', 'attrs', '—', '外层容器样式。', 'Outer-container styling.'),
    ],
  },
  {
    id: 'json-viewer-emits',
    title: { 'zh-CN': '事件', 'en-US': 'Events' },
    kind: 'emits',
    items: ['change', 'update:value'].map((name) =>
      p(name, 'string', '—', '返回完整 JSON 文本。', 'Emits the complete JSON source.'),
    ),
  },
  {
    id: 'json-viewer-methods',
    title: { 'zh-CN': '实例方法', 'en-US': 'Exposed methods' },
    kind: 'methods',
    items: [
      'getValue',
      'format',
      'search',
      'getSearchResults',
      'prevSearch',
      'nextSearch',
      'replace',
      'replaceAll',
    ].map((name) =>
      p(name, '(...args) => unknown', '—', '公开组件 ref 方法。', 'Public component-ref method.'),
    ),
  },
];
