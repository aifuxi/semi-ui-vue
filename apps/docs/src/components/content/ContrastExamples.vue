<script setup lang="ts">
import { useDocsPreferences } from '../../composables/useDocsPreferences';
defineProps<{ kind: 'color' | 'text' | 'state' | 'exception' }>();
const { locale } = useDocsPreferences();
</script>

<template>
  <div class="contrast-examples">
    <template v-if="kind === 'color'">
      <div>
        <span class="example-status" aria-hidden="true">!</span
        ><strong>{{
          locale === 'zh-CN' ? '填写有效的邮箱地址' : 'Enter a valid email address'
        }}</strong>
      </div>
      <p>
        {{
          locale === 'zh-CN'
            ? '颜色配合图标和文字，提供完整的错误信息。'
            : 'Combine color, an icon and text to explain the error.'
        }}
      </p>
    </template>
    <template v-else-if="kind === 'text'">
      <strong>{{ locale === 'zh-CN' ? '清晰可读的正文' : 'Readable body text' }}</strong>
      <p>
        {{
          locale === 'zh-CN'
            ? '同时检查文本颜色、背景颜色和字号。'
            : 'Check text color, background color and font size together.'
        }}
      </p>
    </template>
    <template v-else-if="kind === 'state'">
      <button type="button">
        {{ locale === 'zh-CN' ? '按 Tab 查看焦点' : 'Press Tab to inspect focus' }}
      </button>
      <p>
        {{
          locale === 'zh-CN'
            ? '焦点轮廓应在背景上清晰可见。'
            : 'The focus outline should remain visible against its background.'
        }}
      </p>
    </template>
    <template v-else>
      <button type="button" disabled>
        {{ locale === 'zh-CN' ? '不可用操作' : 'Unavailable action' }}
      </button>
      <p>
        {{
          locale === 'zh-CN'
            ? '禁用状态与仍可操作的控件需要分别判断。'
            : 'Assess inactive controls separately from controls that remain operable.'
        }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.contrast-examples {
  margin: 24px 0;
  padding: 32px;
  border: 1px solid var(--semi-color-border);
  border-radius: 6px;
  background: var(--semi-color-bg-1);
  color: var(--semi-color-text-0);
}
.contrast-examples p {
  margin: 16px 0 0;
  font-size: 14px;
}
.example-status {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--semi-color-danger);
  color: var(--semi-color-white);
}
.contrast-examples button {
  padding: 8px 16px;
  border: 2px solid currentColor;
  border-radius: 4px;
  color: inherit;
  background: transparent;
}
.contrast-examples button:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 4px;
}
.contrast-examples button:disabled {
  opacity: 0.45;
}
</style>
