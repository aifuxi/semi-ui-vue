<script setup lang="ts">
import { Skeleton } from '@workspace/ui';
</script>

<template>
  <div class="skeleton-scenario" data-testid="skeleton-vue">
    <Skeleton active data-parity-target="skeleton-root">
      <template #placeholder>
        <div class="skeleton-scenario__profile-placeholder">
          <Skeleton.Avatar data-parity-target="skeleton-avatar-default" />
          <div class="skeleton-scenario__profile-copy">
            <Skeleton.Title
              data-parity-target="skeleton-title"
              style="width: 140px; margin-bottom: 12px"
            />
            <Skeleton.Paragraph :rows="3" />
          </div>
        </div>
      </template>
      <article>Profile loaded</article>
    </Skeleton>

    <div class="skeleton-scenario__items">
      <Skeleton.Avatar size="extra-small" />
      <Skeleton.Avatar data-parity-target="skeleton-avatar-square" shape="square" size="large" />
      <Skeleton.Button data-parity-target="skeleton-button" />
      <div class="skeleton-scenario__paragraph" data-parity-target="skeleton-paragraph">
        <Skeleton.Paragraph :rows="4" />
      </div>
    </div>

    <Skeleton
      data-parity-target="skeleton-image-root"
      :loading="true"
      style="width: 180px; height: 108px"
    >
      <template #placeholder>
        <Skeleton.Image data-parity-target="skeleton-image" />
      </template>
      <span>Image loaded</span>
    </Skeleton>

    <Skeleton :loading="false">
      <template #placeholder><Skeleton.Title /></template>
      <p class="skeleton-scenario__loaded" data-parity-target="skeleton-loaded">Content ready</p>
    </Skeleton>
  </div>
</template>
