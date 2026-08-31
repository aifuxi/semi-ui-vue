import React, { useEffect, useRef } from 'react';
import AudioPlayer from '@semi-v2.102.0/audio-player';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import {
  AUDIO_PLAYER_COVER_DATA_URI,
  createSilentAudioDataUri,
  type ParityDirection,
  type ParityLocale,
  type ParityThemeMode,
} from '@workspace/test-infra';

const playlist = [
  {
    title: 'Parity track A',
    cover: AUDIO_PLAYER_COVER_DATA_URI,
    src: createSilentAudioDataUri(4),
  },
  {
    title: 'Parity track B',
    cover: AUDIO_PLAYER_COVER_DATA_URI,
    src: createSilentAudioDataUri(6),
  },
];

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    AudioPlayer: {
      backward: '后退 ${skipDuration} 秒',
      forward: '前进 ${skipDuration} 秒',
      prev: '上一首',
      next: '下一首',
      loop: '循环播放',
      volume: '音量',
      mediaError: '音频加载失败',
    },
  },
  'en-US': {
    code: 'en-US',
    AudioPlayer: {
      backward: 'Backward ${skipDuration}s',
      forward: 'Forward ${skipDuration}s',
      prev: 'Previous',
      next: 'Next',
      loop: 'Loop',
      volume: 'Volume',
      mediaError: 'Audio load error',
    },
  },
};

export function AudioPlayerScenario({
  direction,
  locale,
  theme,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
  theme: ParityThemeMode;
}): React.ReactElement {
  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  if (typeof document !== 'undefined' && popupContainerRef.current === null) {
    popupContainerRef.current = document.createElement('div');
    popupContainerRef.current.dataset.testid = 'audio-player-popup-reference';
    document.body.appendChild(popupContainerRef.current);
  }

  useEffect(
    () => () => {
      popupContainerRef.current?.remove();
      popupContainerRef.current = null;
    },
    [],
  );

  return (
    <ConfigProvider
      direction={direction}
      locale={localeMap[locale]}
      getPopupContainer={() => popupContainerRef.current ?? document.body}
    >
      <div className="audio-player-scenario" data-testid="audio-player-reference">
        <section className="audio-player-scenario__card audio-player-scenario__main">
          <h3>Playlist / toolbar</h3>
          <AudioPlayer
            audioUrl={playlist}
            data-parity-target="audio-player-main"
            skipDuration={1}
            theme={theme}
          />
        </section>
        <section className="audio-player-scenario__card audio-player-scenario__compact">
          <h3>Compact / no toolbar</h3>
          <AudioPlayer
            audioUrl={{
              title: 'Compact track',
              cover: AUDIO_PLAYER_COVER_DATA_URI,
              src: createSilentAudioDataUri(4),
            }}
            data-parity-target="audio-player-compact"
            showToolbar={false}
            theme={theme}
          />
        </section>
      </div>
    </ConfigProvider>
  );
}
