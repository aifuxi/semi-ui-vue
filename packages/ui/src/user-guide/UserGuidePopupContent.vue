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
  isPrimary: boolean;
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

defineOptions({ name: 'UserGuidePopupContent' });
defineProps<Props>();
</script>

<template>
  <div
    class="semi-userGuide-popup-content"
    :class="{ 'semi-userGuide-popup-content-primary': isPrimary }"
  >
    <div v-if="cover" class="semi-userGuide-popup-content-cover">
      <UserGuideNodeRenderer :content="cover" />
    </div>
    <div class="semi-userGuide-popup-content-body">
      <div v-if="title" class="semi-userGuide-popup-content-title">
        <UserGuideNodeRenderer :content="title" />
      </div>
      <div v-if="description" class="semi-userGuide-popup-content-description">
        <UserGuideNodeRenderer :content="description" />
      </div>
      <div class="semi-userGuide-popup-content-footer">
        <div v-if="stepCount > 1" class="semi-userGuide-popup-content-indicator">
          {{ current + 1 }}/{{ stepCount }}
        </div>
        <div class="semi-userGuide-popup-content-buttons">
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
      </div>
    </div>
  </div>
</template>
