import type { Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
const initialMessages = [
  {
    id: '1',
    role: 'user',
    content: '我想开发一个 Multi Agent 场景下的聊天应用，你能帮我设计一下吗？',
    status: 'completed',
  },
  {
    id: '2',
    role: 'assistant',
    name: 'PM',
    content: [
      {
        type: 'message',
        content: [
          {
            type: 'input_text',
            text: '收到。为保证方案可落地，我先明确目标与范围：\n\n- 目标：支持多 Agent 协同回复，用户可选择 Agent 或由系统自动分配\n- MVP 功能：\n  1) 基础对话（文本/图片/文件）\n  2) Agent 身份标识与头像\n  3) 正在输入与流式输出\n  4) 引用来源与工具结果展示\n- 约束：先做单会话，不做云端持久化；优先移动端适配\n\n接下来我会整理 PRD 要点并同步给设计与前端。',
            annotations: [
              {
                title: 'Semi Design',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail:
                  'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户',
                logo: '/demos/one.svg',
              },
              {
                title: 'Semi DSM',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail:
                  'Semi DSM 支持全局、组件级别的样式定制，并在 Figma 和线上代码之间保持同步。使用 DSM，将 Semi Design 适配为 Any Design',
                logo: '/demos/one.svg',
              },
              {
                title: 'Semi D2C',
                url: 'https://semi.design/zh-CN/start/getting-started',
                detail:
                  'Semi D2C 提供开箱即用的设计稿转代码：支持一键识别 Figma 页面中图层布局 + 设计系统组件，像素级还原设计稿，转译为 React JSX 和 CSS 代码。此外还提供了丰富的扩展能力，基于自定义插件系统快速打造团队专属的设计研发协作工具。',
                logo: '/demos/one.svg',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    role: 'assistant',
    name: 'PM',
    content: [
      {
        type: 'message',
        content: [
          {
            type: 'input_text',
            text: '生成的PRD如下，设计师会先根据此摘要出信息架构与关键页面',
          },
          {
            type: 'resource',
            name: 'PRD.doc',
            size: '100KB',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    role: 'assistant',
    name: 'UI',
    content: [
      {
        id: 'rs_02175871288540800000000000000000000ffffac1598778c9aa5',
        type: 'reasoning',
        summary: [
          {
            type: 'summary_text',
            text: '\n根据产品经理给的 PRD 绘制关键页面，我需要....',
          },
        ],
        status: 'completed',
      },
      {
        type: 'function_call',
        name: 'paint_key_pages',
        arguments: '{"file":"PRD"}',
        status: 'completed',
      },
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            text: '设计初稿如下：\n\n- 信息架构：对话页（历史列表 | 消息流 | 工具卡片区）\n- 视觉：左侧展示 Agent 头像与名称标签，色块区分角色\n- 交互：\n  - 输入区支持 @Agent 快速切换与建议提示\n  - 流式输出时展示打字气泡与进度占位\n  - 工具结果以卡片/步骤条形式插入，可展开详情与复制\n\n我先出低保真线框，稍后补高保真与动效说明。',
          },
        ],
        status: 'completed',
      },
    ],
    status: 'completed',
  },
  {
    id: '5',
    role: 'assistant',
    name: 'FE',
    content:
      '技术方案建议：\n\n- 技术栈：Vue + @aifuxi/semi-ui-vue，后端采用 WebSocket 或 SSE 支持流式响应\n- 数据模型：消息包含 id、role、name、content、status、references 等字段\n- 组件拆分：AIChatInput + AIChatDialogue；内容采用 Markdown 渲染，支持图片与文件点击\n- 性能：虚拟列表与滚动置底；长文本分块渲染；图片懒加载\n- 可观测性：埋点消息延迟、出错率、工具调用耗时\n\n若确认，我可先搭建页面骨架并接入 mock 数据进行联调。',
  },
];

// 自定义 resource 扩展由 renderDialogueContentItem 负责展示。
export const defaultMessages: Message[] = initialMessages;
