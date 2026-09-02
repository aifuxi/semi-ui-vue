<script setup lang="ts">
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
  IllustrationFailure,
  IllustrationFailureDark,
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationNoAccess,
  IllustrationNoAccessDark,
  IllustrationNoContent,
  IllustrationNoContentDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
  IllustrationNotFound,
  IllustrationNotFoundDark,
  IllustrationSuccess,
  IllustrationSuccessDark,
} from '@aifuxi/semi-illustrations-vue';

const illustrationPairs = [
  { name: 'Construction', light: IllustrationConstruction, dark: IllustrationConstructionDark },
  { name: 'Failure', light: IllustrationFailure, dark: IllustrationFailureDark },
  { name: 'Idle', light: IllustrationIdle, dark: IllustrationIdleDark },
  { name: 'NoAccess', light: IllustrationNoAccess, dark: IllustrationNoAccessDark },
  { name: 'NoContent', light: IllustrationNoContent, dark: IllustrationNoContentDark },
  { name: 'NoResult', light: IllustrationNoResult, dark: IllustrationNoResultDark },
  { name: 'NotFound', light: IllustrationNotFound, dark: IllustrationNotFoundDark },
  { name: 'Success', light: IllustrationSuccess, dark: IllustrationSuccessDark },
] as const;
</script>

<template>
  <div class="illustrations-scenario" data-testid="illustrations-vue">
    <template v-for="pair in illustrationPairs" :key="pair.name">
      <figure class="illustrations-scenario__item" :aria-label="pair.name">
        <component
          :is="pair.light"
          class="illustrations-scenario__svg"
          :data-illustration="pair.name"
        />
      </figure>
      <figure
        class="illustrations-scenario__item illustrations-scenario__item--dark"
        :aria-label="`${pair.name}Dark`"
      >
        <component
          :is="pair.dark"
          class="illustrations-scenario__svg"
          :data-illustration="`${pair.name}Dark`"
        />
      </figure>
    </template>
  </div>
</template>
