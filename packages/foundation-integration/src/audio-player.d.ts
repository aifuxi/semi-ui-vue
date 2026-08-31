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

export interface AudioPlayerFoundationProps {
  audioUrl: unknown;
  autoPlay: boolean;
  skipDuration: number;
}

export interface AudioPlayerFoundationState {
  isPlaying: boolean;
  currentIndex: number;
  totalTime: number;
  currentTime: number;
  currentRate: { label: string; value: number };
  volume: number;
  error: boolean;
}

export interface AudioPlayerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  init(): void;
  destroy(): void;
  resetAudioState(): void;
  handleStatusClick(): void;
  handleTimeUpdate(): void;
  handleTrackChange(direction: 'next' | 'prev'): void;
  getAudioRef(): HTMLAudioElement;
  handleTimeChange(value: number): void;
  handleSpeedChange(value: { label: string; value: number }): void;
  handleSeek(direction: number): void;
  handleRefresh(): void;
  handleVolumeChange(value: number): void;
}

export const audioPlayerCssClasses: { PREFIX: string };

export class AudioPlayerFoundation<
  Props extends AudioPlayerFoundationProps,
  State extends AudioPlayerFoundationState,
> {
  constructor(adapter: AudioPlayerAdapter<Props, State>);
  init(): void;
  destroy(): void;
  initAudioState(): void;
  endHandler(): void;
  errorHandler(): void;
  resetAudioState(): void;
  handleStatusClick(): void;
  handleTimeUpdate(): void;
  handleTrackChange(direction: 'next' | 'prev'): void;
  handleTimeChange(value: number): void;
  handleSpeedChange(value: { label: string; value: number }): void;
  handleSeek(direction: number): void;
  handleRefresh(): void;
  handleVolumeChange(value: number): void;
}
