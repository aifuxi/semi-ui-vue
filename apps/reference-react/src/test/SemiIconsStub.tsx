import React from 'react';
import SemiIconStub from './SemiIconStub';

function createIcon(type: string): React.ComponentType<Record<string, unknown>> {
  return function StubIcon(props): React.ReactElement {
    return (
      <SemiIconStub
        {...props}
        type={type}
        svg={
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path fill="currentColor" d="M2 2h20v20H2z" />
          </svg>
        }
      />
    );
  };
}

export const IconAIFilledLevel2 = createIcon('ai_filled_level_2');
export const IconAIWandLevel3 = createIcon('ai_wand_level_3');
export const IconEmoji = createIcon('emoji');
export const IconHome = createIcon('home');
export const IconLikeHeart = createIcon('like_heart');
export const IconSpin = createIcon('spin');
