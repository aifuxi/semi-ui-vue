import React, { useEffect, useRef } from 'react';
import VideoPlayer from '@semi-v2.102.0/video-player';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import {
  VIDEO_PLAYER_POSTER_DATA_URI,
  createSilentAudioDataUri,
  type ParityDirection,
  type ParityLocale,
  type ParityThemeMode,
} from '@workspace/test-infra';

const mediaFixture = createSilentAudioDataUri(4);

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    VideoPlayer: {
      rateChange: '切换速率至 ${rate}',
      qualityChange: '切换清晰度至${quality}',
      routeChange: '切换线路至${route}',
      mirror: '镜像',
      cancelMirror: '取消镜像',
      loading: '加载中...',
      stall: '加载失败',
      noResource: '暂无资源',
      videoError: '视频加载错误',
    },
  },
  'en-US': {
    code: 'en-US',
    VideoPlayer: {
      rateChange: 'Switch rate to ${rate}',
      qualityChange: 'Switch quality to ${quality}',
      routeChange: 'Switch route to ${route}',
      mirror: 'Mirror',
      cancelMirror: 'Cancel mirror',
      loading: 'Loading...',
      stall: 'Loading failed',
      noResource: 'No resource',
      videoError: 'Video load error',
    },
  },
};

export function VideoPlayerScenario({
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
    popupContainerRef.current.dataset.testid = 'video-player-popup-reference';
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
      <div className="video-player-scenario" data-testid="video-player-reference">
        <section className="video-player-scenario__card video-player-scenario__main">
          <h3>Chapters / full controls</h3>
          <VideoPlayer
            data-parity-target="video-player-main"
            src={mediaFixture}
            poster={VIDEO_PLAYER_POSTER_DATA_URI}
            width={720}
            height={405}
            theme={theme}
            defaultQuality="1080p"
            defaultRoute="line-1"
            markers={[
              { start: 0, title: 'Intro' },
              { start: 1, title: 'Features' },
              { start: 3, title: 'Summary' },
            ]}
            seekTime={1}
            qualityList={[
              { label: '1080p', value: '1080p' },
              { label: '480p', value: '480p' },
            ]}
            routeList={[
              { label: locale === 'zh-CN' ? '线路一' : 'Route 1', value: 'line-1' },
              { label: locale === 'zh-CN' ? '线路二' : 'Route 2', value: 'line-2' },
            ]}
          />
        </section>
        <section className="video-player-scenario__card video-player-scenario__compact">
          <h3>Compact controls</h3>
          <VideoPlayer
            data-parity-target="video-player-compact"
            src={mediaFixture}
            poster={VIDEO_PLAYER_POSTER_DATA_URI}
            width={480}
            height={270}
            theme={theme}
            controlsList={['play', 'time', 'volume', 'playbackRate', 'fullscreen']}
          />
        </section>
      </div>
    </ConfigProvider>
  );
}
