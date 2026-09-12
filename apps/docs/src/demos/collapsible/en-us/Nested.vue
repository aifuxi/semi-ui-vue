<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { shallowRef } from 'vue';
const isOpen = shallowRef(false);
const childOpen = shallowRef(false);
</script>

<template>
  <div>
    <Button @click="isOpen = !isOpen">Toggle</Button><br /><Collapsible :is-open="isOpen"
      ><div>
        <span>Conntent of first level</span
        ><Button @click="childOpen = !childOpen">Toggle List</Button>
      </div>
      <Collapsible :is-open="childOpen"
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
