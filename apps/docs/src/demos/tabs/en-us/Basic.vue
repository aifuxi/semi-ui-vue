<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs type="line">
    <TabPane tab="Document" item-key="1">
      <h3>Document</h3>
      <p :style="{ lineHeight: 1.8 }">
        Semi Design is a design system developed and maintained by IES Front-end Team and UED Team
      </p>
      <p :style="{ lineHeight: 1.8 }">
        Semi Design create a consistent, good-looking, easy-to-use, and efficient user experience
        with a user-centric, content-first, and human-friendly design system.
      </p>
      <ul>
        <li>
          <p>Content-first</p>
        </li>
        <li>
          <p>Customized theming</p>
        </li>
        <li>
          <p>Internationalized</p>
        </li>
        <li>
          <p>Humanism</p>
        </li>
      </ul>
    </TabPane>
    <TabPane tab="Quick Start" item-key="2">
      <h3>Quick Start</h3>

      <pre
        :style="{
          margin: '24px 0',
          padding: '20px',
          border: 'none',
          whiteSpace: 'normal',
          borderRadius: 'var(--semi-border-radius-medium)',
          color: 'var(--semi-color-text-1)',
          backgroundColor: 'var(--semi-color-fill-0)',
        }"
      >
                            <code>pnpm add @aifuxi/semi-ui-vue @aifuxi/semi-theme-default</code>
                        </pre>
    </TabPane>
    <TabPane tab="Help" item-key="3">
      <h3>Help</h3>
      <p :style="{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }">
        Q: Who should I look for if there are new component requirements, or existing component does
        not meet my needs?
      </p>
      <p :style="{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }">
        Give feedbacks in the upper right corner, submit an Issue, describe your needs as well as
        the business scenario. We'll handle these issues with priorities.
      </p>
      <p :style="{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }">
        Q: Have questions when using components?
      </p>
      <p :style="{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }">
        Welcome to ask anything in our Lark customer service group.
      </p>
    </TabPane>
  </Tabs>
</template>
