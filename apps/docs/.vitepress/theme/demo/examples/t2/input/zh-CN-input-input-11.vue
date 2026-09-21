<script setup lang="ts">
import { Input, InputGroup } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>

<template>
  <div>
    <InputGroup>
      <Input placeholder="Name" :style="{ width: '100px' }"></Input>
      <InputNumber placeholder="Score" :style="{ width: '140px' }"></InputNumber>
    </InputGroup>
    <br /><br /><br />
    <InputGroup size="small">
      <Select :style="{ width: '100px' }" default-value="home">
        <SelectOption value="home">Home</SelectOption>
        <SelectOption value="work">Work</SelectOption>
      </Select>
      <AutoComplete :data="['Beijing Haidian']" placeholder="Address: " :style="{ width: '180px' }">
      </AutoComplete>
    </InputGroup>
    <br /><br /><br />
    <InputGroup size="small">
      <Select :style="{ width: '100px' }" default-value="signup">
        <SelectOption value="signup">Sign Up</SelectOption>
        <SelectOption value="signin">Sign In</SelectOption>
      </Select>
      <Input placeholder="Email" :style="{ width: '180px' }"></Input>
    </InputGroup>
    <br /><br /><br />
    <InputGroup size="small">
      <Input placeholder="Name" :style="{ width: '100px' }"></Input>
      <DatePicker placeholder="Birthday"></DatePicker>
    </InputGroup>
  </div>
</template>
