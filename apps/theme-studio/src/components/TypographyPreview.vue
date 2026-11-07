<script setup lang="ts">
import { dieluTypeRoles } from '../dielu-typography-preset';
</script>

<template>
  <section class="typography-gallery" aria-label="文字排版角色">
    <div v-for="role in dieluTypeRoles" :key="role.name" class="type-role-row">
      <div class="type-role-label">
        {{ role.label }}<code>{{ role.name }}</code>
      </div>
      <p :class="`dielu-type-${role.name}`" :data-testid="`type-${role.name}`">
        {{ role.name === 'code' ? 'font-size: 13px;' : 'Theme Studio · 主题样式设计' }}
      </p>
    </div>
  </section>
</template>
