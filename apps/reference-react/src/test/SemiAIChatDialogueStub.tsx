import React from 'react';

export default function SemiAIChatDialogueStub(props: Record<string, unknown>): React.ReactElement {
  const chats = Array.isArray(props.chats) ? props.chats : [];
  const hints = Array.isArray(props.hints) ? props.hints : [];
  return (
    <div className="semi-ai-chat-dialogue">
      <div className="semi-ai-chat-dialogue-list">
        {chats.map((message, index) => {
          const item = message as { content?: React.ReactNode; id?: unknown; role?: string };
          return (
            <div className="semi-ai-chat-dialogue-wrapper" key={String(item.id ?? index)}>
              <div className="semi-ai-chat-dialogue-container">
                <div className="semi-ai-chat-dialogue-content">{item.content}</div>
              </div>
            </div>
          );
        })}
        <section className="semi-ai-chat-dialogue-hints">
          {hints.map((hint, index) => (
            <div className="semi-ai-chat-dialogue-hint-item" key={index}>
              {String(hint)}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
