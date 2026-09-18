<script setup lang="ts">
import { SplitTagGroup, Tag, TagGroup, type TagData } from '@aifuxi/semi-ui-vue/tag';

const tagList: TagData[] = [
  { tagKey: 'one', content: 'One', color: 'blue' },
  { tagKey: 'two', content: 'Two', color: 'cyan' },
  { tagKey: 'three', content: 'Three', color: 'teal' },
  { tagKey: 'four', content: 'Four', color: 'green' },
];
</script>

<template>
  <div class="tag-scenario" data-testid="tag-vue">
    <div class="tag-scenario__row" data-parity-target="tag-basic">
      <Tag color="blue" type="solid" size="large">Primary</Tag>
      <Tag color="amber" closable>Closable</Tag>
      <Tag color="violet" shape="circle">Rounded</Tag>
    </div>
    <div data-parity-target="tag-group">
      <TagGroup :max-tag-count="2" :tag-list="tagList" />
    </div>
    <div data-parity-target="tag-split">
      <SplitTagGroup aria-label="connected tags">
        <Tag color="blue" type="solid">One</Tag>
        <Tag color="cyan" type="solid">Two</Tag>
        <Tag color="teal" type="solid">Three</Tag>
      </SplitTagGroup>
    </div>
  </div>
</template>
