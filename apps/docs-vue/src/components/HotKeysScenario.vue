<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue';

const localTarget = useTemplateRef<HTMLDivElement>('localTarget');
const status = shallowRef('Ready');
</script>

<template>
  <div class="hot-keys-scenario" data-testid="hot-keys-vue">
    <section class="hot-keys-scenario__card">
      <h3>Modifier combination</h3>
      <p>Strict Control + Shift + K matching.</p>
      <HotKeys
        :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.Shift, HotKeys.Keys.K]"
        data-parity-target="hot-keys-basic"
        @hot-key="status = 'Body Control+Shift+K'"
      />
    </section>

    <section class="hot-keys-scenario__card">
      <h3>Display labels</h3>
      <p>Content changes labels without changing the shortcut.</p>
      <HotKeys
        :hot-keys="[HotKeys.Keys.Meta, HotKeys.Keys.Enter]"
        :content="['⌘', 'Enter']"
        prevent-default
        data-parity-target="hot-keys-content"
        @hot-key="status = 'Body Meta+Enter'"
      />
    </section>

    <section class="hot-keys-scenario__card">
      <h3>Custom render</h3>
      <p>The render node keeps the fixed root container.</p>
      <HotKeys
        :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.R]"
        data-parity-target="hot-keys-custom"
        @click="status = 'Custom clicked'"
      >
        <span class="hot-keys-scenario__custom">Run command</span>
      </HotKeys>
    </section>

    <section class="hot-keys-scenario__card">
      <h3>Scoped target</h3>
      <div ref="localTarget" class="hot-keys-scenario__target" tabindex="0">
        <span>Focus or dispatch inside this panel</span>
        <HotKeys
          :hot-keys="[HotKeys.Keys.Alt, HotKeys.Keys.ArrowDown]"
          :content="['Alt', '↓']"
          :get-listener-target="() => localTarget"
          data-parity-target="hot-keys-local"
          @hot-key="status = 'Local Alt+ArrowDown'"
        />
      </div>
    </section>

    <output class="hot-keys-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
