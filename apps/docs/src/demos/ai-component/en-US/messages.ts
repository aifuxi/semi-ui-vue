import type { Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
const initialMessages = [
  {
    id: '1',
    role: 'user',
    content:
      'I want to develop a chat application for a multi-agent scenario. Can you help me design it?',
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
            text: 'Received. To ensure the feasibility of the solution, I will first clarify the goals and scope:\n\n- Goal: Support multi-agent collaborative replies, where users can choose an agent or the system can automatically assign one.\n- MVP Features:\n 1) Basic conversation (text/image/file)\n 2) Agent identification and avatar\n 3) Input in progress and streaming output\n 4) Display of cited sources and tool results\n- Constraints: Focus on single-session implementation first, without cloud persistence; prioritize mobile adaptation.\n\nNext, I will organize the PRD key points and share them with the design and front-end teams.',
            annotations: [
              {
                title: 'Semi Design',
                url: 'https://semi.design/en-US/start/getting-started',
                detail:
                  'Semi Design is a design system designed, developed, and maintained by the Douyin front-end team and the MED product design team. As a comprehensive, user-friendly, and high-quality modern application UI solution, Semi Design is derived from the complex scenarios across ByteDance various business lines. It currently supports nearly a thousand platform products and serves over 100,000 internal and external users.',
                logo: '/demos/one.svg',
              },
              {
                title: 'Semi DSM',
                url: 'https://semi.design/en-US/start/getting-started',
                detail:
                  'Semi DSM supports global and component-level style customization and maintains synchronization between Figma and online code. Using DSM, Semi Design can be adapted to Any Design.',
                logo: '/demos/one.svg',
              },
              {
                title: 'Semi D2C',
                url: 'https://semi.design/en-US/start/getting-started',
                detail:
                  'Semi D2C offers out-of-the-box design-to-code conversion: it supports one-click recognition of layer layouts and design system components in Figma pages, reproducing design drafts pixel-perfectly and translating them into React JSX and CSS code. Furthermore, it provides rich extensibility, allowing teams to quickly create their own custom design and development collaboration tools based on a custom plugin system.',
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
            text: 'The generated PRD is as follows. The designer will first use this summary to create the information architecture and key pages.',
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
            text: '\nBased on the PRD provided by the product manager, I need to draw the key pages.',
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
            text: "The initial design draft is as follows:\n\n- Information Architecture: Dialogue Page (History List | Message Flow | Tool Card Area)\n- Visuals: The left side displays Agent avatars and name tags, with color blocks distinguishing roles\n- Interaction:\n- Input area supports quick switching and suggestion prompts using @Agent\n- During streaming output, a typing bubble and progress placeholder are displayed\n- Tool results are inserted in the form of cards/step bars, which can be expanded for details and copied\n\nI'll start with a low-fidelity wireframe; high-fidelity and animation details will be added later.",
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
      'Technical Solution Suggestions:\n\n- Technology Stack: Vue + @aifuxi/semi-ui-vue, backend using WebSocket or SSE to support streaming responses\n- Data Model: Messages include fields such as id, role, name, content, status, and references\n- Component Splitting: AIChatInput + AIChatDialogue; content rendered using Markdown, supporting image and file clicks\n- Performance: Virtual list and scroll-to-bottom; long text chunked rendering; lazy loading of images\n- Observability: Message tracking latency, error rate, and tool call time\n\nIf confirmed, I can first build the page skeleton and integrate mock data for integration testing.',
  },
];

// 自定义 resource 扩展由 renderDialogueContentItem 负责展示。
export const defaultMessages: Message[] = initialMessages;
