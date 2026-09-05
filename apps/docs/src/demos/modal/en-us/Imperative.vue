<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/modal.css';
import { h, onBeforeUnmount } from 'vue';
import {
  Modal,
  type ModalHandle,
  type ModalProps,
  type ModalConfirmType,
} from '@aifuxi/semi-ui-vue/modal';
import { IconSend } from '@aifuxi/semi-icons-vue';
const handles = new Set<ModalHandle>();
function open(type: ModalConfirmType, config: ModalProps) {
  let handle: ModalHandle;
  handle = Modal[type]({
    okText: 'Confirm',
    cancelText: 'Cancel',
    ...config,
    afterClose: () => handles.delete(handle),
  });
  handles.add(handle);
}
function info() {
  open('info', { title: 'Here is some info', content: 'bla bla bla...' });
}
function success() {
  open('success', {
    title: 'This is a success message',
    content: 'bla bla bla...',
  });
}
function error() {
  open('error', {
    title: 'Unfortunately, there is an error',
    content: 'bla bla bla...',
  });
}
function warning() {
  open('warning', {
    title: 'Warning: be cautious ahead',
    content: 'bla bla bla...',
  });
}
function confirm() {
  open('confirm', { title: 'Are you sure ?', content: 'bla bla bla...' });
}
function custom() {
  open('info', {
    title: 'This is a custom modal',
    content: 'bla bla bla...',
    icon: h(IconSend),
    cancelButtonProps: { theme: 'borderless' },
    okButtonProps: { theme: 'solid' },
  });
}
onBeforeUnmount(() => {
  handles.forEach((handle) => handle.destroy());
  handles.clear();
});
</script>
<template>
  <div>
    <Button @click="info">Info</Button><br /><br /><Button @click="success">Success</Button
    ><br /><br /><Button type="danger" @click="error">Error</Button><br /><br /><Button
      type="warning"
      @click="warning"
      >Warning</Button
    ><br /><br /><Button type="primary" @click="confirm">Confirm</Button><br /><br /><Button
      @click="custom"
      >Custom</Button
    >
  </div>
</template>
