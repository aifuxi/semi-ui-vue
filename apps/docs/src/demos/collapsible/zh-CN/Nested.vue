<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { shallowRef, useId } from 'vue';
const isOpen = shallowRef(false);
const panelId = useId();
const childOpen = shallowRef(false);
const childId = useId();
</script>

<template>
  <div>
    <Button :aria-expanded="isOpen" :aria-controls="panelId" @click="isOpen = !isOpen"
      >Toggle</Button
    ><br /><Collapsible :id="panelId" :is-open="isOpen"
      ><div>
        <span>Semi Design 的设计原则包括：</span
        ><Button :aria-expanded="childOpen" :aria-controls="childId" @click="childOpen = !childOpen"
          >Toggle List</Button
        >
      </div>
      <Collapsible :id="childId" :is-open="childOpen"
        ><ul>
          <li><p>Semi Design 以内容优先进行设计。</p></li>
          <li><p>更容易地自定义主题。</p></li>
          <li><p>适用国际化场景。</p></li>
          <li><p>效率场景加入人性化关怀。</p></li>
        </ul></Collapsible
      ></Collapsible
    >
  </div>
</template>
