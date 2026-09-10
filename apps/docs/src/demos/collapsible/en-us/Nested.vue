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
        <span>Conntent of first level</span
        ><Button :aria-expanded="childOpen" :aria-controls="childId" @click="childOpen = !childOpen"
          >Toggle List</Button
        >
      </div>
      <Collapsible :id="childId" :is-open="childOpen"
        ><ul>
          <li>Nothing can ever happen twice.</li>
          <li>In consequence, the sorry fact is</li>
          <li>that we arrive here improvised</li>
          <li>and leave without the chance to practice.</li>
        </ul></Collapsible
      ></Collapsible
    >
  </div>
</template>
