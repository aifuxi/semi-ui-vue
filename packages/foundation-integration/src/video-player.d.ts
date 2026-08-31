interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: unknown): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface VideoPlayerFoundationProps {
  controlsList: readonly string[];
  muted: boolean;
  seekTime: number;
  volume: number;
}

export interface VideoPlayerFoundationState {
  bufferedValue: number;
  currentQuality: string;
  currentRoute: string;
  currentTime: number;
  isError: boolean;
  isMirror: boolean;
  isPlaying: boolean;
  muted: boolean;
  notificationContent: string;
  playbackRate: number;
  showNotification: boolean;
  showControls: boolean;
  totalTime: number;
  volume: number;
}

export interface VideoPlayerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getVideo(): HTMLVideoElement | null;
  getVideoWrapper(): HTMLDivElement | null;
  notifyPause(): void;
  notifyPlay(): void;
  notifyQualityChange(quality: string): void;
  notifyRateChange(rate: number): void;
  notifyRouteChange(route: string): void;
  notifyVolumeChange(volume: number): void;
  setBufferedValue(value: number): void;
  setCurrentTime(value: number): void;
  setIsError(value: boolean): void;
  setIsMirror(value: boolean): void;
  setIsPlaying(value: boolean): void;
  setMuted(value: boolean): void;
  setNotificationContent(value: string): void;
  setPlaybackRate(value: number): void;
  setQuality(value: string): void;
  setRoute(value: string): void;
  setShowControls(value: boolean): void;
  setShowNotification(value: boolean): void;
  setTotalTime(value: number): void;
  setVolume(value: number): void;
}

export class VideoPlayerFoundation<
  Props extends VideoPlayerFoundationProps,
  State extends VideoPlayerFoundationState,
> {
  constructor(adapter: VideoPlayerAdapter<Props, State>);
  shouldShowControlItem(name: string): boolean;
  handleTimeChange(value: number): void;
  handleTimeUpdate(): void;
  handleDurationChange(): void;
  handleError(): void;
  handlePlayOrPause(): void;
  handlePlay(): void;
  handlePause(): void;
  handleVideoPlay(): void;
  handleVideoPause(): void;
  handleCanPlay(): void;
  handleWaiting(locale: unknown): void;
  handleStalled(locale: unknown): void;
  handleProgress(): void;
  handleEnded(): void;
  handleVolumeChange(value: number): void;
  handleVolumeSilent(): void;
  checkFullScreen(): boolean;
  handleLeavePictureInPicture(): void;
}

export interface VideoMarker {
  start: number;
  title: string;
}

export interface VideoMarkerListItem extends VideoMarker {
  end: number;
  left: string;
  width: string;
}

export interface VideoProgressFoundationProps {
  bufferedValue: number;
  max: number;
  onChange(value: number): void;
  value: number;
}

export interface VideoProgressFoundationState {
  activeIndex: number;
  isDragging: boolean;
  isHandleHovering: boolean;
  movingInfo: { progress: number; offset: number; value: number } | null;
}

export interface VideoProgressAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getSliderRef(): HTMLDivElement | null;
  getMarkersList(): VideoMarkerListItem[];
  setIsDragging(value: boolean): void;
  setIsHandleHovering(value: boolean): void;
  setActiveIndex(value: number): void;
  setMovingInfo(value: VideoProgressFoundationState['movingInfo']): void;
}

export class VideoProgressFoundation<
  Props extends VideoProgressFoundationProps,
  State extends VideoProgressFoundationState,
> {
  constructor(adapter: VideoProgressAdapter<Props, State>);
  handleDocumentMouseUp(): void;
  handleMouseDown(event: MouseEvent): void;
  handleMouseUp(): void;
  handleMouseEvent(event: MouseEvent, shouldSetValue?: boolean): void;
  handleSliderMouseEnter(index: number): void;
  handleSliderMouseLeave(index: number): void;
  getPlayedWidth(marker: VideoMarkerListItem): string;
  getLoadedWidth(marker: VideoMarkerListItem): string;
}

export const videoPlayerCssClasses: {
  PREFIX: string;
  PREFIX_CONTROLS: string;
  PREFIX_PROGRESS: string;
};
export const videoPlayerStrings: {
  DARK: 'dark';
  LIGHT: 'light';
  PLAY: 'play';
  NEXT: 'next';
  TIME: 'time';
  VOLUME: 'volume';
  PLAYBACK_RATE: 'playbackRate';
  QUALITY: 'quality';
  ROUTE: 'route';
  MIRROR: 'mirror';
  FULLSCREEN: 'fullscreen';
  PICTURE_IN_PICTURE: 'pictureInPicture';
};
export const videoPlayerNumbers: {
  DEFAULT_VOLUME: 100;
  DEFAULT_SEEK_TIME: 10;
  DEFAULT_VOLUME_STEP: 10;
  DEFAULT_PLAYBACK_RATE: 1;
};
export const videoPlayerDefaultPlaybackRate: Array<{ label: string; value: number }>;
