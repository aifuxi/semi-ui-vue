import React, { useState } from 'react';
import AIChatDialogue, { type Message } from '@semi-v2.102.0/ai-chat-dialogue';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Button from '@semi-v2.102.0/button';
import Input from '@semi-v2.102.0/input';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

export function AIChatDialogueScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  // 固定查询覆盖左右对齐、选择态和六种公开消息状态，避免自定义 renderer 掩盖状态 UI。
  const query = new URLSearchParams(window.location.search);
  const requestedMode = query.get('dialogueMode');
  const reviewMode =
    requestedMode === 'noBubble' || requestedMode === 'userBubble' ? requestedMode : 'bubble';
  const reviewAlign = query.get('dialogueAlign') === 'leftAlign' ? 'leftAlign' : 'leftRight';
  const reviewStates = query.get('dialogueState') === 'matrix';
  const reviewSelecting = query.get('dialogueSelecting') === 'true';
  const reviewEditor = query.get('dialogueEditor') === 'true';
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
    ...(reviewStates
      ? ['queued', 'in_progress', 'incomplete', 'failed', 'cancelled'].map((status) => ({
          id: `state-${status}`,
          role: 'assistant',
          content: status === 'queued' ? '' : `回答状态：${status}`,
          status,
        }))
      : []),
  ]);
  const [editValue, setEditValue] = useState(labels.question);
  const finishEditing = (save: boolean) =>
    setChats(
      chats.map((message) =>
        message.editing
          ? { ...message, editing: false, ...(save ? { content: editValue } : {}) }
          : message,
      ),
    );
  // 固定基线编辑态由公开 renderer 提供，使用同源 Input 与按钮复核内容容器。
  const messageEditRender = () => (
    <div style={{ width: '100%', marginTop: 5 }}>
      <Input value={editValue} onChange={setEditValue} />
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <Button onClick={() => finishEditing(true)}>保存</Button>
        <Button onClick={() => finishEditing(false)}>取消</Button>
      </div>
    </div>
  );
  return (
    <ConfigProvider
      direction={direction}
      locale={{
        code: locale,
        Typography:
          locale === 'zh-CN'
            ? { copy: '复制', copied: '复制成功', expand: '展开', collapse: '收起' }
            : { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
        AIChatDialogue:
          locale === 'zh-CN'
            ? {
                delete: '删除',
                deleteConfirm: '确认要删除吗？',
                deleteContent: '删除后将无法恢复！',
                copySuccess: '复制成功',
                loading: '请稍候...',
                reasoning: { completed: '已思考完成', thinking: '正在思考中...' },
                annotationText: '篇资料',
              }
            : {
                delete: 'Delete',
                deleteConfirm: 'Delete this message?',
                deleteContent: 'This cannot be undone.',
                copySuccess: 'Copied',
                loading: 'Loading...',
                reasoning: { completed: 'Reasoning completed', thinking: 'Thinking...' },
                annotationText: 'sources',
              },
      }}
    >
      <div className="ai-chat-dialogue-scenario" data-testid="ai-chat-dialogue-reference">
        <AIChatDialogue
          chats={chats}
          mode={reviewMode}
          align={reviewAlign}
          selecting={reviewSelecting}
          hints={[labels.hint]}
          style={{
            height: reviewStates ? 1000 : 430,
            width: '100%',
            border: '1px solid var(--semi-color-border)',
            borderRadius: 16,
          }}
          roleConfig={{
            assistant: { name: labels.assistant },
            user: { name: labels.user },
          }}
          {...(reviewStates || reviewEditor
            ? {}
            : {
                dialogueRenderConfig: {
                  renderDialogueContent: ({ message, className }) => (
                    <div className={className}>{String(message?.content ?? '')}</div>
                  ),
                },
              })}
          {...(reviewEditor ? { messageEditRender } : {})}
          onChatsChange={setChats}
        />
      </div>
    </ConfigProvider>
  );
}
