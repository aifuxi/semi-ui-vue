<script setup lang="ts">
import { Divider } from '@workspace/ui';
</script>

<template>
  <div class="divider-scenario" data-testid="divider-vue">
    <section class="divider-scenario__section" aria-label="基础分割线">
      <span>Semi Design 是一个设计系统。</span>
      <Divider
        margin="12px"
        role="separator"
        aria-label="章节分隔"
        data-parity-target="divider-horizontal-solid"
      />
      <span>它定义了一套中后台设计与前端基础组件。</span>

      <span>Semi Design 支持虚线分隔。</span>
      <Divider dashed margin="12px" data-parity-target="divider-horizontal-dashed" />
      <span>水平模式的 margin 作用于上下方向。</span>

      <div class="divider-scenario__inline-row">
        <span>左</span>
        <Divider
          layout="vertical"
          margin="12px"
          role="separator"
          aria-orientation="vertical"
          aria-label="操作分隔"
          data-parity-target="divider-vertical-solid"
        />
        <span>中</span>
        <Divider
          layout="vertical"
          dashed
          margin="12px"
          data-parity-target="divider-vertical-dashed"
        />
        <span>右</span>
      </div>
    </section>

    <section class="divider-scenario__section" aria-label="带内容的分割线">
      <Divider margin="12px" align="left" data-parity-target="divider-content-left">
        这是居左文字
      </Divider>
      <Divider margin="12px" align="center" data-parity-target="divider-content-center">
        这是居中文字
      </Divider>
      <Divider margin="12px" align="right" data-parity-target="divider-content-right">
        这是居右文字
      </Divider>
      <Divider margin="12px" data-parity-target="divider-custom-content">
        <span class="divider-scenario__mark" aria-hidden="true">◆</span>
      </Divider>
    </section>
  </div>
</template>
