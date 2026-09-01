import React from 'react';

export default function SemiChatStub(props: Record<string, unknown>): React.ReactElement {
  const chats = Array.isArray(props.chats) ? props.chats : [];
  const hints = Array.isArray(props.hints) ? props.hints : [];
  return (
    <div className="semi-chat">
      <div className="semi-chat-container">
        {chats.map((message, index) => {
          const item = message as { content?: React.ReactNode; id?: unknown; role?: string };
          return (
            <div className="semi-chat-chatBox" key={String(item.id ?? index)}>
              <div className="semi-chat-chatBox-content">{item.content}</div>
            </div>
          );
        })}
        <div className="semi-chat-hints">
          {hints.map((hint, index) => (
            <div className="semi-chat-hint-item" key={index}>
              {String(hint)}
            </div>
          ))}
        </div>
      </div>
      <div className="semi-chat-inputBox-container" />
    </div>
  );
}
