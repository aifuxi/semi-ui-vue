import React from 'react';

export interface SemiAudioPlayerStubProps extends React.HTMLAttributes<HTMLDivElement> {
  audioUrl: string | { title?: string; cover?: string; src: string } | Array<unknown>;
  autoPlay?: boolean;
  showToolbar?: boolean;
  skipDuration?: number;
  theme?: 'dark' | 'light';
}

export default function SemiAudioPlayerStub({
  audioUrl: _audioUrl,
  autoPlay: _autoPlay,
  showToolbar = true,
  skipDuration: _skipDuration,
  theme = 'dark',
  ...props
}: SemiAudioPlayerStubProps): React.ReactElement {
  void _audioUrl;
  void _autoPlay;
  void _skipDuration;
  return (
    <div {...props} className={`semi-audio-player semi-audio-player-${theme}`}>
      <div className="semi-audio-player-control" />
      <div className="semi-audio-player-info">
        <div className="semi-audio-player-info-time">
          <span>0:00</span>
          <span>/</span>
          <span>0:04</span>
        </div>
        <div className="semi-audio-player-slider-horizontal" />
      </div>
      {showToolbar ? <div className="semi-audio-player-control" /> : null}
    </div>
  );
}
