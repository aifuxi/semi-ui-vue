import React, { useState } from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Chat, { type ChatMessage } from '@semi-v2.102.0/chat';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    Typography: { copy: '复制', copied: '复制成功', expand: '展开', collapse: '收起' },
    Chat: {
      deleteConfirm: '确认删除该会话吗？',
      clearContext: '上下文已清除',
      copySuccess: '复制成功',
      stop: '停止',
      copy: '复制',
      copied: '复制成功',
      dropAreaText: '将文件放到这里',
    },
  },
  'en-US': {
    code: 'en-US',
    Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
    Chat: {
      deleteConfirm: 'Delete this message?',
      clearContext: 'Context cleared',
      copySuccess: 'Copied',
      stop: 'Stop',
      copy: 'Copy',
      copied: 'Copied',
      dropAreaText: 'Put the file here',
    },
  },
};

export function ChatScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  // 查询只选取公开视觉变体；状态矩阵使用默认渲染以显示 loading/error 反馈。
  const query = new URLSearchParams(window.location.search);
  const requestedMode = query.get('chatMode');
  const reviewMode =
    requestedMode === 'noBubble' || requestedMode === 'userBubble' ? requestedMode : 'bubble';
  const reviewAlign = query.get('chatAlign') === 'leftAlign' ? 'leftAlign' : 'leftRight';
  // 仅状态矩阵显式禁用发送；普通场景保留 canSend 缺省的空输入判定。
  const reviewStates = query.get('chatState') === 'matrix';
  const reviewDefaultRender = reviewStates || query.get('reviewDefaultRender') === 'true';
  const labels =
    locale === 'zh-CN'
      ? {
          assistant: '助手',
          user: '用户',
          question: '请介绍 Semi',
          answer: 'Semi 是面向现代应用的设计系统。',
          hint: '继续了解',
        }
      : {
          assistant: 'Assistant',
          user: 'User',
          question: 'Introduce Semi',
          answer: 'Semi is a design system for modern applications.',
          hint: 'Learn more',
        };
  const [chats, setChats] = useState<ChatMessage[]>([
    { id: 'assistant-1', role: 'assistant', content: labels.answer, status: 'complete' },
    { id: 'user-1', role: 'user', content: labels.question, status: 'complete' },
    {
      id: 'assistant-2',
      role: 'assistant',
      content: '**Ready** for the next question.',
      status: 'complete',
    },
    ...(reviewStates
      ? (['loading', 'incomplete', 'error'] as const).map((status) => ({
          id: `state-${status}`,
          role: 'assistant',
          content: status === 'loading' ? '' : `回答状态：${status}`,
          status,
        }))
      : []),
  ]);
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="chat-scenario" data-testid="chat-reference">
        <Chat
          chats={chats}
          mode={reviewMode}
          align={reviewAlign}
          {...(reviewStates ? { canSend: false } : {})}
          showStopGenerate={reviewStates}
          hints={[labels.hint]}
          enableUpload={false}
          style={{
            height: reviewStates ? 850 : 430,
            width: '100%',
            border: '1px solid var(--semi-color-border)',
            borderRadius: 16,
          }}
          roleConfig={{ assistant: { name: labels.assistant }, user: { name: labels.user } }}
          {...(reviewDefaultRender
            ? {}
            : {
                chatBoxRenderConfig: {
                  renderChatBoxContent: ({
                    message,
                    className,
                  }: {
                    message?: ChatMessage;
                    className: string;
                  }) => <div className={className}>{String(message?.content ?? '')}</div>,
                },
              })}
          renderHintBox={({ content, index, onHintClick }) => (
            <div key={index} className="semi-chat-hint-item" onClick={onHintClick}>
              <span className="semi-chat-hint-content">{content}</span>
              <span className="semi-chat-hint-icon">→</span>
            </div>
          )}
          onChatsChange={setChats}
        />
      </div>
    </ConfigProvider>
  );
}
