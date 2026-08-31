import React from 'react';
import type { FeedbackProps } from '@semi-v2.102.0/feedback';

export default function SemiFeedbackStub(props: FeedbackProps): React.ReactElement | null {
  if (!props.visible) return null;
  return (
    <div className={`semi-feedback semi-feedback-${props.type ?? 'emoji'}`}>
      {props.type === 'emoji' ? (
        <div className="semi-feedback-emoji-container">
          {['😞', '😐', '😃'].map((emoji) => (
            <span className="semi-feedback-emoji-item" key={emoji}>
              {emoji}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
