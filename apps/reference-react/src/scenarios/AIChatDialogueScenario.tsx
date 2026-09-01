import React, { useState } from 'react';
import AIChatDialogue, { type Message } from '@semi-v2.102.0/ai-chat-dialogue';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

export function AIChatDialogueScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  const labels =
    locale === 'zh-CN'
      ? {
          assistant: '助手',
          user: '用户',
          question: '请介绍 Semi',
          answer: 'Semi 是面向现代应用的设计系统。',
          detail: '支持主题、国际化与无障碍能力。',
          hint: '继续了解',
        }
      : {
          assistant: 'Assistant',
          user: 'User',
          question: 'Introduce Semi',
          answer: 'Semi is a design system for modern applications.',
          detail: 'It supports theming, i18n, and accessibility.',
          hint: 'Learn more',
        };
  const [chats, setChats] = useState<Message[]>([
    { id: 'assistant-1', role: 'assistant', content: labels.answer, status: 'completed' },
    { id: 'user-1', role: 'user', content: labels.question, status: 'completed' },
    { id: 'assistant-2', role: 'assistant', content: labels.detail, status: 'completed' },
  ]);
  return (
    <ConfigProvider direction={direction} locale={{ code: locale }}>
      <div className="ai-chat-dialogue-scenario" data-testid="ai-chat-dialogue-reference">
        <AIChatDialogue
          chats={chats}
          hints={[labels.hint]}
          style={{
            height: 430,
            width: '100%',
            border: '1px solid var(--semi-color-border)',
            borderRadius: 16,
          }}
          roleConfig={{
            assistant: { name: labels.assistant },
            user: { name: labels.user },
          }}
          dialogueRenderConfig={{
            renderDialogueContent: ({ message, className }) => (
              <div className={className}>{String(message?.content ?? '')}</div>
            ),
          }}
          onChatsChange={setChats}
        />
      </div>
    </ConfigProvider>
  );
}
