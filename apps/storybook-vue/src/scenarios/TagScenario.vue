<script setup lang="ts">
import {
  SplitTagGroup,
  Tag,
  TagGroup,
  type TagData,
  type TagSize,
  type TagType,
} from '@aifuxi/semi-ui-vue/tag';

/** 仅显式 review query 选择额外公开尺寸与类型，默认快照不变。 */
const reviewQuery = new URLSearchParams(window.location.search);
/** 三档尺寸均来自固定 Semi 的公开 API。 */
const reviewSize = (
  ['small', 'default', 'large'].includes(reviewQuery.get('reviewSize') ?? '')
    ? reviewQuery.get('reviewSize')
    : undefined
) as TagSize | undefined;
/** light/solid/ghost 覆盖不同颜色消费分支。 */
const reviewType = (
  ['light', 'solid', 'ghost'].includes(reviewQuery.get('reviewType') ?? '')
    ? reviewQuery.get('reviewType')
    : undefined
) as TagType | undefined;

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
      <Tag color="blue" :type="reviewType ?? 'solid'" :size="reviewSize ?? 'large'">Primary</Tag>
      <Tag color="amber" :type="reviewType ?? 'light'" :size="reviewSize ?? 'default'" closable
        >Closable</Tag
      >
      <Tag
        color="violet"
        :type="reviewType ?? 'light'"
        :size="reviewSize ?? 'default'"
        shape="circle"
        >Rounded</Tag
      >
    </div>
    <div data-parity-target="tag-group">
      <TagGroup :max-tag-count="2" :tag-list="tagList" :size="reviewSize ?? 'default'" />
    </div>
    <div data-parity-target="tag-split">
      <SplitTagGroup aria-label="connected tags">
        <Tag color="blue" :type="reviewType ?? 'solid'" :size="reviewSize ?? 'default'">One</Tag>
        <Tag color="cyan" :type="reviewType ?? 'solid'" :size="reviewSize ?? 'default'">Two</Tag>
        <Tag color="teal" :type="reviewType ?? 'solid'" :size="reviewSize ?? 'default'">Three</Tag>
      </SplitTagGroup>
    </div>
  </div>
</template>
