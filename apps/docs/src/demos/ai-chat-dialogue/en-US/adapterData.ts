export const CHAT_COMPLETION_DATA = {
  id: 'chatcmpl-B9MBs8CjcvOU2jLn4n570S5qMJKcT',
  object: 'chat.completion',
  created: 1741569952,
  model: 'gpt-4.1-2025-04-14',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'Hello! How can I assist you today?',
        refusal: null,
        annotations: [],
        tool_calls: [
          {
            id: 'call_abc123',
            type: 'function',
            function: {
              name: 'get_current_weather',
              arguments: '{\n"location": "Boston, MA"\n}',
            },
          },
        ],
      },
      logprobs: null,
      finish_reason: 'stop',
    },
  ],
};
export const STREAMING_CHAT_COMPLETION_DATA = [
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          role: 'assistant',
          content: '',
          refusal: null,
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'ahPqlzj6DD',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          content: '',
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'i2PXRIwvc3D',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          content: " I'm using ",
        },
        finish_reason: null,
      },
    ],
    obfuscation: '3sslO5QylW',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          content: 'streamingChatCompletionToMessage',
        },
        finish_reason: null,
      },
    ],
    obfuscation: '3sslO5QylW',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011845,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 1,
        delta: {
          tool_calls: [
            {
              id: 'call_1',
              function: {
                name: 'searchWeather',
                arguments: '{"city":"Beijing"}',
              },
            },
          ],
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'T1',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011846,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 1,
        delta: {
          tool_calls: [
            {
              id: 'call_1',
              function: {
                name: null,
                arguments: ',"day":"today"}',
              },
            },
          ],
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'T2',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011844,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          content: ' transform to Chat Completion Chunks',
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'X1',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011844,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {
          content: ' 🥳',
        },
        finish_reason: null,
      },
    ],
    obfuscation: 'X2',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
    obfuscation: 'n13SLf',
  },
  {
    id: 'chatcmpl-COjljxurV5GKrRUsg1wd7mIyQCiiT',
    object: 'chat.completion.chunk',
    created: 1760011843,
    model: 'o3-mini-2025-01-31',
    service_tier: 'default',
    system_fingerprint: 'fp_6c43dcef8c',
    choices: [
      {
        index: 1,
        delta: {},
        finish_reason: 'stop',
      },
    ],
    obfuscation: 'jt9rDb',
  },
];
export const RESPONSE_DATA = {
  id: 'resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41',
  object: 'response',
  created_at: 1741476777,
  status: 'completed',
  error: null,
  incomplete_details: null,
  instructions: null,
  max_output_tokens: null,
  model: 'gpt-4o-2024-08-06',
  output: [
    {
      id: 'rs_6876cf02e0bc8192b74af0fb64b715ff06fa2fcced15a5ac',
      type: 'reasoning',
      status: 'completed',
      summary: [
        {
          type: 'summary_text',
          text: '**What is Semi Design?** The user asks for "Semi Design" which requires aggregating multiple sources. First, ByteDance\'s Semi Design is a design system supporting multiple platforms with Design Tokens and code conversion tools. Another result from India focuses on semiconductor training, but the user likely refers to the ByteDance one. Other results mention semi-custom design but are less relevant. We should confirm if there are other interpretations, but current info covers the main dimensions. Continuing to reason may improve completeness, but it\'s sufficient to answer now.',
        },
      ],
    },
    {
      type: 'message',
      id: 'msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41',
      status: 'completed',
      role: 'assistant',
      content: [
        {
          type: 'output_text',
          text: "Semi Design is a design system created and maintained by ByteDance's Frontend Team and the MED Product Design Team. You can ask me anything about Semi.",
          annotations: [
            {
              title: 'Semi Design',
              url: 'https://semi.design/zh-CN/start/getting-started',
              detail: 'Semi Design Getting Started',
              logo: '/demos/two.svg',
            },
            {
              title: 'Semi Design',
              url: 'https://semi.design/zh-CN/start/getting-started',
              detail: 'Semi Design Getting Started',
              logo: '/demos/two.svg',
            },
            {
              title: 'Semi Design',
              url: 'https://semi.design/zh-CN/start/getting-started',
              detail: 'Semi Design Getting Started',
              logo: '/demos/two.svg',
            },
          ],
        },
      ],
    },
    {
      id: 'fc_12345xyz',
      call_id: 'call_12345xyz',
      type: 'function_call',
      name: 'get_semi_page',
      status: 'completed',
      arguments: '{"pageName":"AIChatDialogue"}',
    },
  ],
};
export const REASONING_CHUNKS = [
  {
    type: 'response.created',
    sequence_number: 0,
    response: {
      id: 'resp_reason_001',
      object: 'response',
      created_at: 1760091777,
      status: 'in_progress',
      background: false,
      error: null,
      incomplete_details: null,
      instructions: null,
      max_output_tokens: null,
      max_tool_calls: null,
      model: 'o3-mini-2025-01-31',
      output: [],
      parallel_tool_calls: true,
      previous_response_id: null,
      prompt_cache_key: null,
      reasoning: {
        effort: 'medium',
        summary: null,
      },
      safety_identifier: null,
      service_tier: 'auto',
      store: true,
      temperature: 1,
      text: {
        format: {
          type: 'text',
        },
        verbosity: 'medium',
      },
      tool_choice: 'auto',
      tools: [],
      top_logprobs: 0,
      top_p: 1,
      truncation: 'disabled',
      usage: null,
      user: null,
      metadata: {},
    },
  },
  {
    type: 'response.in_progress',
    sequence_number: 1,
    response: {
      id: 'resp_reason_001',
      object: 'response',
      created_at: 1760091777,
      status: 'in_progress',
      background: false,
      error: null,
      incomplete_details: null,
      instructions: null,
      max_output_tokens: null,
      max_tool_calls: null,
      model: 'o3-mini-2025-01-31',
      output: [],
      parallel_tool_calls: true,
      previous_response_id: null,
      prompt_cache_key: null,
      reasoning: {
        effort: 'medium',
        summary: null,
      },
      safety_identifier: null,
      service_tier: 'auto',
      store: true,
      temperature: 1,
      text: {
        format: {
          type: 'text',
        },
        verbosity: 'medium',
      },
      tool_choice: 'auto',
      tools: [],
      top_logprobs: 0,
      top_p: 1,
      truncation: 'disabled',
      usage: null,
      user: null,
      metadata: {},
    },
  },
  {
    type: 'response.output_item.added',
    sequence_number: 2,
    output_index: 0,
    item: {
      id: 'rs_reason_001',
      type: 'reasoning',
      summary: [],
    },
  },
  {
    type: 'response.reasoning_summary_part.added',
    sequence_number: 3,
    output_index: 0,
    summary_index: 0,
    part: {
      type: 'reasoning',
      text: '',
    },
  },
  {
    type: 'response.reasoning_summary_text.delta',
    sequence_number: 4,
    output_index: 0,
    summary_index: 0,
    delta: 'T',
  },
  {
    type: 'response.reasoning_summary_text.delta',
    sequence_number: 5,
    output_index: 0,
    summary_index: 0,
    delta: 'h',
  },
  {
    type: 'response.reasoning_summary_text.delta',
    sequence_number: 6,
    output_index: 0,
    summary_index: 0,
    delta: 'i',
  },
  {
    type: 'response.reasoning_summary_text.delta',
    sequence_number: 7,
    output_index: 0,
    summary_index: 0,
    delta: 'n',
  },
  {
    type: 'response.reasoning_summary_text.delta',
    sequence_number: 8,
    output_index: 0,
    summary_index: 0,
    delta: 'k',
  },
  {
    type: 'response.reasoning_summary_text.done',
    sequence_number: 9,
    output_index: 0,
    summary_index: 0,
    text: 'Done thinking!',
  },
  {
    type: 'response.output_item.done',
    sequence_number: 10,
    output_index: 0,
    item: {
      id: 'rs_reason_001',
      type: 'reasoning',
      summary: [
        {
          type: 'reasoning',
          text: '思考完成！',
        },
      ],
    },
  },
  {
    type: 'response.output_item.added',
    sequence_number: 11,
    output_index: 1,
    item: {
      id: 'msg_reason_001',
      type: 'message',
      status: 'in_progress',
      content: [],
      role: 'assistant',
    },
  },
  {
    type: 'response.content_part.added',
    sequence_number: 12,
    item_id: 'msg_reason_001',
    output_index: 1,
    content_index: 0,
    part: {
      type: 'output_text',
      annotations: [],
      text: '',
    },
  },
  {
    type: 'response.output_text.delta',
    sequence_number: 13,
    item_id: 'msg_reason_001',
    output_index: 1,
    content_index: 0,
    delta: 'Based on the reasoning above, ',
  },
  {
    type: 'response.output_text.delta',
    sequence_number: 14,
    item_id: 'msg_reason_001',
    output_index: 1,
    content_index: 0,
    delta: 'the conclusions are:',
  },
  {
    type: 'response.output_text.done',
    sequence_number: 15,
    item_id: 'msg_reason_001',
    output_index: 1,
    content_index: 0,
    text: 'Based on the reasoning above, the conclusions are: ...',
  },
  {
    type: 'response.completed',
    sequence_number: 16,
    response: {
      id: 'resp_reason_001',
      object: 'response',
      created_at: 1760091777,
      status: 'completed',
      background: false,
      error: null,
      incomplete_details: null,
      instructions: null,
      max_output_tokens: null,
      max_tool_calls: null,
      model: 'o3-mini-2025-01-31',
      output: [
        {
          id: 'rs_reason_001',
          type: 'reasoning',
          summary: [
            {
              type: 'reasoning',
              text: '思考完成！',
            },
          ],
        },
        {
          id: 'msg_reason_001',
          type: 'message',
          status: 'completed',
          content: [
            {
              type: 'output_text',
              annotations: [],
              text: '基于上述思考，结论如下：...',
            },
          ],
          role: 'assistant',
        },
      ],
      parallel_tool_calls: true,
      previous_response_id: null,
      prompt_cache_key: null,
      reasoning: {
        effort: 'medium',
        summary: null,
      },
      safety_identifier: null,
      service_tier: 'default',
      store: true,
      temperature: 1,
      text: {
        format: {
          type: 'text',
        },
        verbosity: 'medium',
      },
      tool_choice: 'auto',
      tools: [],
      top_logprobs: 0,
      top_p: 1,
      truncation: 'disabled',
      usage: {
        input_tokens: 12,
        input_tokens_details: {
          cached_tokens: 0,
        },
        output_tokens: 120,
        output_tokens_details: {
          reasoning_tokens: 16,
        },
        total_tokens: 132,
      },
      user: null,
      metadata: {},
    },
  },
];
export const FIXED_SHUFFLED_INDICES = [0, 1, 2, 3, 4, 6, 6, 7, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16];
