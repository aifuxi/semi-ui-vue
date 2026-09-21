<script setup lang="ts">
import { onMounted, ref } from 'vue';
// @ts-expect-error Prism 1.30.0 未提供类型声明。
import Prism from 'prismjs';
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';
import '@aifuxi/semi-theme-default/code-highlight.css';

const ready = ref(false);
onMounted(async () => {
  Object.assign(globalThis, { Prism });
  // @ts-expect-error Prism 1.30.0 的语言包未提供类型声明。
  await import('prismjs/components/prism-vala.js');
  ready.value = true;
});

const code =
  'public class ExampleApp : Gtk.Application {\n    public ExampleApp () {\n        Object (application_id: "com.example.App");\n    }\n\n    public override void activate () {\n        var win = new Gtk.ApplicationWindow (this);\n\n        var btn = new Gtk.Button.with_label ("Hello World");\n        btn.clicked.connect (win.close);\n\n        win.child = btn;\n        win.present ();\n    }\n\n    public static int main (string[] args) {\n        var app = new ExampleApp ();\n        return app.run (args);\n    }\n}\n';
</script>

<template>
  <CodeHighlight v-if="ready" :code="code" language="vala" />
</template>
