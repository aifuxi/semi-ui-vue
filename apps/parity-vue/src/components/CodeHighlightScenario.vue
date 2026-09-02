<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';

const javascriptCode = [
  'const message = "Hello, Semi";',
  'function greet(name) {',
  '  return `${message}: ${name}`;',
  '}',
].join('\n');

const cssCode = [
  '.card {',
  '  color: var(--semi-color-text-0);',
  '  padding: 12px 16px;',
  '}',
].join('\n');

const markupCode = '<button type="button">Run safely</button>';
</script>

<template>
  <div class="code-highlight-scenario" data-testid="code-highlight-vue">
    <section class="code-highlight-scenario__item">
      <h3>JavaScript · line numbers</h3>
      <CodeHighlight
        :code="javascriptCode"
        language="javascript"
        data-parity-target="code-highlight-javascript"
      />
    </section>
    <section class="code-highlight-scenario__item">
      <h3>CSS · plain</h3>
      <CodeHighlight
        :code="cssCode"
        language="css"
        :line-number="false"
        data-parity-target="code-highlight-css"
      />
    </section>
    <section class="code-highlight-scenario__item code-highlight-scenario__custom">
      <h3>Markup · custom theme</h3>
      <CodeHighlight
        :code="markupCode"
        language="markup"
        :line-number="false"
        :default-theme="false"
        data-parity-target="code-highlight-custom"
      />
    </section>
  </div>
</template>
