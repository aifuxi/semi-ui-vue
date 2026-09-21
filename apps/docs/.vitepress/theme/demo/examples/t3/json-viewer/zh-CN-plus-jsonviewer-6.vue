<script setup lang="ts">
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/json-viewer.css';
import { h } from 'vue';
import type { JsonViewerCustomRenderRule } from '@aifuxi/semi-ui-vue/json-viewer';
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/rating.css';
import '@aifuxi/semi-theme-default/popover.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/image.css';
const data =
  '{\n  "name": "Semi",\n  "version": "2.7.4",\n  "rating": 5,\n  "tags": ["design", "react", "ui"],\n  "image": "/demos/photo.svg"\n}';
// Token render callbacks require VNodes; all editor state remains in JsonViewer.
const customRenderRule: JsonViewerCustomRenderRule[] = [
  {
    match: 'Semi',
    render: (content) =>
      h(
        Popover,
        { showArrow: true, content: '我是用户自定义的渲染', trigger: 'hover' },
        { default: () => h('span', content) },
      ),
  },
  {
    match: (value) => value === 5,
    render: (content) => h(Rating, { defaultValue: Number(content), size: 10, disabled: true }),
  },
  {
    match: (_value, path) => ['root.tags[0]', 'root.tags[1]', 'root.tags[2]'].includes(path),
    render: (content) => h(Tag, { size: 'small', shape: 'circle' }, () => content),
  },
  // Use the existing local illustration so the example also works offline.
  {
    match: /^\/demos\//,
    render: (content) =>
      h(
        Popover,
        { showArrow: true, trigger: 'hover' },
        {
          default: () => h('span', content),
          content: () => h(Image, { width: 100, height: 100, src: content.replace(/^"|"$/g, '') }),
        },
      ),
  },
];
</script>

<template>
  <ConfigProvider :locale="locale">
    <div style="margin: 16px 0">
      <JsonViewer
        :height="200"
        :width="600"
        :value="data"
        :show-search="false"
        :options="{
          formatOptions: { tabSize: 4, insertSpaces: true, eol: '\n' },
          customRenderRule,
          readOnly: true,
          autoWrap: true,
        }"
      />
    </div>
  </ConfigProvider>
</template>
