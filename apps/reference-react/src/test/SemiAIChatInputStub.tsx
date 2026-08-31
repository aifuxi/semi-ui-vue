import React from 'react';

export default function SemiAIChatInputStub(props: Record<string, unknown>): React.ReactElement {
  return (
    <div className="semi-aiChatInput">
      <div className="semi-aiChatInput-references">
        {Array.isArray(props.references) ? String(props.references.length) : ''}
      </div>
      <div className="semi-aiChatInput-editor-content">{String(props.defaultContent ?? '')}</div>
      <div className="semi-aiChatInput-footer" />
    </div>
  );
}
