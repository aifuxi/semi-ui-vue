<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { shallowRef, useId } from 'vue';
const isOpen = shallowRef(false);
const panelId = useId();
</script>

<template>
  <div>
    <Button :aria-expanded="isOpen" :aria-controls="panelId" @click="isOpen = !isOpen"
      >Toggle</Button
    ><br />
    <div style="position: relative">
      <Collapsible
        :id="panelId"
        :is-open="isOpen"
        :collapse-height="60"
        :style="
          isOpen
            ? {}
            : {
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,.2) 80%, transparent 100%)',
              }
        "
        ><ul>
          <li><p>Semi Design 以内容优先进行设计。</p></li>
          <li><p>更容易地自定义主题。</p></li>
          <li><p>适用国际化场景。</p></li>
          <li><p>效率场景加入人性化关怀。</p></li>
        </ul></Collapsible
      ><button
        v-if="!isOpen"
        type="button"
        class="show-more"
        :aria-controls="panelId"
        @click="isOpen = true"
      >
        + Show More
      </button>
    </div>
  </div>
</template>

<style scoped>
.show-more {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  width: 100%;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: var(--semi-color-link);
}
</style>
