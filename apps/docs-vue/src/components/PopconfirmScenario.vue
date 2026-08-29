<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';

import { Button, ConfigProvider, Popconfirm } from '@workspace/ui';
import type { ParityDirection } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection }>();
const host = useTemplateRef<HTMLDivElement>('host');
const defaultVisible = shallowRef(true);
const getPopupContainer = () => host.value ?? document.body;
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div ref="host" class="popconfirm-scenario" data-testid="popconfirm-vue">
      <div v-if="host" class="popconfirm-scenario__triggers">
        <Popconfirm
          v-model:visible="defaultVisible"
          class="popconfirm-scenario__default"
          content="This change cannot be undone."
          :get-popup-container="getPopupContainer"
          :motion="false"
          :position="props.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'"
          title="Save this change?"
          trigger="custom"
        >
          <Button data-parity-target="popconfirm-trigger-default">Default</Button>
        </Popconfirm>
        <Popconfirm
          cancel-text="Back"
          class="popconfirm-scenario__danger"
          content="The selected record will be removed."
          :get-popup-container="getPopupContainer"
          :motion="false"
          ok-text="Delete"
          ok-type="danger"
          :position="props.direction === 'rtl' ? 'bottomLeft' : 'bottomRight'"
          show-arrow
          :show-close-icon="false"
          title="Delete record?"
          trigger="custom"
          visible
        >
          <Button data-parity-target="popconfirm-trigger-danger" type="danger">Danger</Button>
        </Popconfirm>
      </div>
    </div>
  </ConfigProvider>
</template>
