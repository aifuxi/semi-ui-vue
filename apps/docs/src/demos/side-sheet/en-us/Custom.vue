<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Text, Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import {
  Form,
  FormDatePicker,
  FormRadioGroup,
  FormRadio,
  FormSelect,
} from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/radio.css';
const visible = shallowRef(false);
const createdAt = shallowRef<Date>();
function show() {
  createdAt.value = new Date();
  visible.value = true;
}
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div>
      <Button @click="show">More Information</Button
      ><SideSheet
        v-model:visible="visible"
        :header-style="{ borderBottom: '1px solid var(--semi-color-border)' }"
        :body-style="{ borderBottom: '1px solid var(--semi-color-border)' }"
        @cancel="visible = false"
        ><template #title><Title :heading="4">Create New Package</Title></template
        ><template #footer
          ><div style="display: flex; justify-content: flex-end">
            <Button style="margin-right: 8px">Reset</Button><Button theme="solid">Submit</Button>
          </div></template
        ><Form
          ><FormDatePicker
            field="date"
            type="dateTime"
            :init-value="createdAt"
            style="width: 272px"
            :label="{ text: 'Created Time', required: true }"
          /><FormRadioGroup
            field="type"
            label="Target Operating System"
            direction="horizontal"
            init-value="all"
            ><FormRadio value="all">All</FormRadio><FormRadio value="ios">iOS</FormRadio
            ><FormRadio value="android">Android</FormRadio
            ><FormRadio value="web">Web</FormRadio></FormRadioGroup
          ><FormRadioGroup
            field="origin"
            label="Package Origin"
            direction="horizontal"
            init-value="scm"
            ><FormRadio value="scm">Uploaded From SCM</FormRadio
            ><FormRadio value="manual">Uploaded Manually</FormRadio></FormRadioGroup
          ><Banner :full-mode="false" :icon="null" :close-icon="null" bordered
            ><template #description
              ><Text
                >Software Config Management (SCM) is a platform for publish and manage code
                versions. You can compile and manage code versions in this platform.</Text
              ></template
            ></Banner
          ><br /><FormSelect
            field="users"
            :label="{ text: 'Created User', required: true }"
            style="width: 560px"
            multiple
            :init-value="['1', '2', '3', '4']"
            ><SelectOption value="1">Tianyi Lee</SelectOption
            ><SelectOption value="2">Chen Qu</SelectOption
            ><SelectOption value="3">Yan Cai</SelectOption
            ><SelectOption value="4">Wenzhuo Cui</SelectOption></FormSelect
          ></Form
        ></SideSheet
      >
    </div></ConfigProvider
  >
</template>
