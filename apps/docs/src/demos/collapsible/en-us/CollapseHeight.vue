<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { shallowRef, type CSSProperties } from 'vue';
const isOpen = shallowRef(false);
const linkStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  bottom: '-10px',
  fontWeight: 700,
  cursor: 'pointer',
};
</script>

<template>
  <div>
    <Button @click="isOpen = !isOpen">Toggle</Button>
    <div style="position: relative">
      <Collapsible
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
          <li>Nothing can ever happen twice.</li>
          <li>In consequence, the sorry fact is</li>
          <li>that we arrive here improvised</li>
          <li>and leave without the chance to practice.</li>
        </ul></Collapsible
      ><a v-if="!isOpen" :style="linkStyle" @click="isOpen = true"> + Show More </a>
    </div>
  </div>
</template>
