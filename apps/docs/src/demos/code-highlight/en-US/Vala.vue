<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';
import 'prismjs/components/prism-vala.js';
import '@aifuxi/semi-theme-default/code-highlight.css';

const code =
  'public class ExampleApp : Gtk.Application {\n    public ExampleApp () {\n        Object (application_id: "com.example.App");\n    }\n\n    public override void activate () {\n        var win = new Gtk.ApplicationWindow (this);\n\n        var btn = new Gtk.Button.with_label ("Hello World");\n        btn.clicked.connect (win.close);\n\n        win.child = btn;\n        win.present ();\n    }\n\n    public static int main (string[] args) {\n        var app = new ExampleApp ();\n        return app.run (args);\n    }\n}\n';
</script>

<template>
  <CodeHighlight :code="code" language="vala" />
</template>
