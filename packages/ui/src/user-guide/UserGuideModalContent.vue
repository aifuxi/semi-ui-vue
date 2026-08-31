<script setup lang="ts">
import type { VNodeChild } from 'vue';

import Button from '../button/Button.vue';
import UserGuideNodeRenderer from './UserGuideNodeRenderer';
import type { UserGuideLocale } from './types';

interface Props {
  cover?: VNodeChild;
  current: number;
  description?: VNodeChild;
  isFirst: boolean;
  isLast: boolean;
  locale: UserGuideLocale;
  nextBindings: Record<string, unknown>;
  nextText: VNodeChild;
  prevBindings: Record<string, unknown>;
  prevText: VNodeChild;
  showPrevButton: boolean;
  showSkipButton: boolean;
  skipBindings: Record<string, unknown>;
  stepCount: number;
  title?: VNodeChild;
}

defineOptions({ name: 'UserGuideModalContent' });
defineProps<Props>();
</script>

<template>
  <template v-if="cover">
    <div class="semi-userGuide-modal-cover">
      <UserGuideNodeRenderer :content="cover" />
    </div>
    <div class="semi-userGuide-modal-indicator">
      <span
        v-for="index in stepCount"
        :key="index - 1"
        :data-index="index - 1"
        class="semi-userGuide-modal-indicator-item"
        :class="{ 'semi-userGuide-modal-indicator-item-active': index - 1 === current }"
      />
    </div>
  </template>
  <div v-if="title || description" class="semi-userGuide-modal-body">
    <div v-if="title" class="semi-userGuide-modal-body-title">
      <UserGuideNodeRenderer :content="title" />
    </div>
    <div v-if="description" class="semi-userGuide-modal-body-description">
      <UserGuideNodeRenderer :content="description" />
    </div>
  </div>
  <div class="semi-userGuide-modal-footer">
    <Button v-if="showSkipButton && !isLast" v-bind="skipBindings">
      {{ locale.skip }}
    </Button>
    <Button v-if="showPrevButton && !isFirst" v-bind="prevBindings">
      <UserGuideNodeRenderer :content="prevText" />
    </Button>
    <Button v-bind="nextBindings">
      <UserGuideNodeRenderer :content="nextText" />
    </Button>
  </div>
</template>
