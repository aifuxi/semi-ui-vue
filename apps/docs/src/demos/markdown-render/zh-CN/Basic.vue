<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
const raw =
  '\n## \n\n正文内容是普通的文本，也可以**加粗**~~删除线~~和<u>下划线</u> [超链接](https://semi.design) 等 Markdown 与 HTML 的基本语法所支持的富文本，也支持 emoji 🍰\n\n\n部分符号需要转义 \\{\\} \\<\\> ...\n\n<br/>\n<br/>\n---\n#### Semi Design DSM\n[Semi DSM](https://semi.design/dsm) 是 Semi Design 提供的设计系统管理工具（Design System Management），支持全局、组件级别的样式定制，并在 Figma 和前端代码之间保持同步  \n适用于各种规模的团队，无论你是需要简化工作流程，提高团队协作，还是增加生产力，我们都有适合你的功能\n\n##### 中大型企业\n- 多达 3000+ Design Token，深入每一处细节的定制可能，色彩，阴影，边距，圆角，动效，渲染结构均可自由定制，告别 ~~CSS 硬编码~~\n- 功能强大，经过抖音内部数千项目验证过的 UI lib，轻松应对各类复杂场景\n- A11y 无障碍友好，国际化功能完备\n- 面向社区建设，完全开源，无使用限制\n- 从 designOps 到 devOps，自动化工作流，Figma UI Kit 一键刷入主题，生成 Style Guideline，研发一行 npm 代码配置接入\n\n##### 初创企业\n- 无需从 0 到 1 投入大量研发资源，快速复用开源社区优秀方案, 低成本快速定制具备品牌特色的设计系统。\n- 一键支持暗色模式生成，支持根据品牌色快速生成包含 320 个全色阶、兼容深/浅两种模式的色彩系统，并支持动态切换\n- 不断进化，DSM + Semi Design 组件由<u>抖音前端架构团队</u>专业维护，已稳定迭代五年+，值得信赖\n\n##### 自由设计师/个人开发者\n- 低成本快速创建风格各异的设计系统，更少时间，更快交付\n- 研发接入友好，无需反复沟通，交付npm包产物，一键完成代码接入\n\n\n![DSM](/demos/photo.svg)\n\n---\n\n#### MarkdownRender 渲染列表语法\n- 好好地吃饭\n- 好好地睡觉\n- 好好地游玩\n- 好好地学习\n- 好好地聊天\n- 好好地吵架\n- 过着平凡普通的每日 \n\n| 支持 | Markdown 表格 |  c |  d  |\n| - | :- | -: | :-: |\n| 1 | 2 | 3 | 4 |\n| 21 | 22 | 23 | 24 |\n| 31 | 32 | 33 | 34 |\n| 41 | 42 | 43 | 44 |\n\n    ';
</script>
<template>
  <ConfigProvider :locale="locale"
    ><MarkdownRender :raw="raw" :components="MarkdownRender.defaultComponents"
  /></ConfigProvider>
</template>
