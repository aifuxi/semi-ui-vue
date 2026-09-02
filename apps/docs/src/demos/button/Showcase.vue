<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button, ButtonGroup, SplitButtonGroup } from '@aifuxi/semi-ui-vue';
import { IconCamera, IconChevronDown } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/button.css';

const loading = shallowRef(false);

function toggleLoading() {
  loading.value = !loading.value;
}
</script>

<template>
  <div>
    <div>
      <Button theme="solid">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button>
      <Button disabled>Disabled</Button>
    </div>
    <div>
      <Button aria-label="Take a screenshot">
        <template #icon><IconCamera /></template>
      </Button>
      <Button :loading="loading" @click="toggleLoading">
        {{ loading ? 'Saving' : 'Save' }}
      </Button>
      <ButtonGroup aria-label="Text size" size="small">
        <Button>Small</Button>
        <Button size="default">Default</Button>
        <Button size="large">Large</Button>
      </ButtonGroup>
      <SplitButtonGroup aria-label="Publish actions">
        <Button theme="solid">Publish</Button>
        <Button theme="solid" aria-label="More publish actions">
          <template #icon><IconChevronDown /></template>
        </Button>
      </SplitButtonGroup>
    </div>
  </div>
</template>
