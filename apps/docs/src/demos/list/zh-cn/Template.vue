<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const data = [
  'Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。',
  'Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。',
  'Semi Design 以用户中心、内容优先、设计人性化的设计系统，打造一致、好看、好用、高效的用户体验。',
];
</script>

<template>
  <div style="padding: 12px; border: 1px solid var(--semi-color-border); margin: 12px">
    <List :data-source="data"
      ><template #item="{ item, index }"
        ><ListItem
          ><template #header><Avatar color="blue">SE</Avatar></template
          ><template #main
            ><div>
              <span style="color: var(--semi-color-text-0); font-weight: 500">示例标题</span>
              <p
                :style="{
                  color: 'var(--semi-color-text-2)',
                  margin: '4px 0',
                  width: index === 0 ? '420px' : '500px',
                  ...(index === 0
                    ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                    : {}),
                }"
              >
                {{ item }}
              </p>
            </div></template
          ><template #extra
            ><ButtonGroup theme="borderless"
              ><Button>编辑</Button><Button>更多</Button></ButtonGroup
            ></template
          ></ListItem
        ></template
      ></List
    >
  </div>
</template>
