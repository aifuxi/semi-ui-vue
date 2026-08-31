/* eslint-disable vue/one-component-per-file -- local passthrough hosts expose Portal slot contracts. */
import { mount, type VueWrapper } from '@vue/test-utils';
import { computed, defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import enUS from '../locale/source/en_US';
import VideoPlayer from './VideoPlayer.vue';
import { formatVideoTime } from './utils';

const Passthrough = defineComponent({ template: '<div><slot /><slot name="content" /></div>' });
const TooltipPassthrough = defineComponent({
  template: '<div><slot /><slot name="content" /></div>',
});

function mountPlayer(
  props: Record<string, unknown> = {},
  options: { portals?: boolean; locale?: ConfigContextValue['locale'] } = {},
): VueWrapper {
  const provide = options.locale
    ? {
        [configContextKey as symbol]: computed(
          () => ({ direction: 'ltr', locale: options.locale }) as ConfigContextValue,
        ),
      }
    : undefined;
  return mount(VideoPlayer, {
    attachTo: document.body,
    attrs: { 'data-player': 'unit' },
    props: { src: '/video.mp4', width: 500, height: 280, ...props },
    global: {
      ...(provide === undefined ? {} : { provide }),
      ...(options.portals
        ? { stubs: { Dropdown: Passthrough, Popover: Passthrough, Tooltip: TooltipPassthrough } }
        : {}),
    },
  });
}

function media(wrapper: VueWrapper): HTMLVideoElement {
  return wrapper.get('video').element as HTMLVideoElement;
}

function defineMediaNumber(video: HTMLVideoElement, name: string, value: number): void {
  Object.defineProperty(video, name, { configurable: true, writable: true, value });
}

beforeEach(() => {
  semiGlobal.config = {};
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
});

afterEach(() => {
  semiGlobal.config = {};
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('VideoPlayer', () => {
  it('区分 clickToPlay 缺省、显式 false、显式 true 与全局覆盖', async () => {
    await mountPlayer().get('video').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

    await mountPlayer({ clickToPlay: false }).get('video').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

    await mountPlayer({ clickToPlay: true }).get('video').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);

    semiGlobal.config.overrideDefaultProps = { VideoPlayer: { clickToPlay: false } };
    await mountPlayer().get('video').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    await mountPlayer({ clickToPlay: true }).get('video').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(3);
  });

  it('保留固定 DOM、主题、尺寸、根 attrs 与 controlsList', () => {
    const wrapper = mountPlayer({
      className: 'named',
      theme: 'light',
      controlsList: ['play', 'time'],
      style: { marginTop: '3px' },
    });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-videoPlayer', 'named']));
    expect(wrapper.attributes('data-player')).toBe('unit');
    expect((wrapper.element as HTMLElement).style.width).toBe('500px');
    expect((wrapper.element as HTMLElement).style.height).toBe('280px');
    expect((wrapper.element as HTMLElement).style.marginTop).toBe('3px');
    expect(wrapper.find('.semi-videoPlayer-wrapper-light').exists()).toBe(true);
    expect(wrapper.findAll('.semi-videoPlayer-controls-menu-button')).toHaveLength(1);
    expect(wrapper.find('.semi-videoPlayer-controls-time').exists()).toBe(true);
    expect(wrapper.find('.semi-videoPlayer-controls-popup').exists()).toBe(false);
  });

  it('按媒体事件同步时间、缓冲、错误、播放态与 emit 顺序', async () => {
    const wrapper = mountPlayer({}, { portals: true });
    const video = media(wrapper);
    defineMediaNumber(video, 'duration', 125);
    video.dispatchEvent(new Event('durationchange'));
    defineMediaNumber(video, 'currentTime', 61);
    video.dispatchEvent(new Event('timeupdate'));
    Object.defineProperty(video, 'buffered', {
      configurable: true,
      value: { length: 1, start: () => 0, end: () => 90 },
    });
    video.dispatchEvent(new Event('progress'));
    await nextTick();
    expect(wrapper.get('.semi-videoPlayer-controls-time').text()).toBe('01:01 / 02:05');
    expect(wrapper.get('.semi-videoPlayer-progress-slider-buffered').attributes('style')).toContain(
      '72%',
    );

    video.dispatchEvent(new Event('play'));
    await nextTick();
    expect(wrapper.emitted('play')).toHaveLength(1);
    expect(wrapper.find('.semi-icon-pause').exists()).toBe(true);
    video.dispatchEvent(new Event('pause'));
    await nextTick();
    expect(wrapper.emitted('pause')).toHaveLength(1);
    expect(wrapper.find('.semi-icon-play').exists()).toBe(true);

    video.dispatchEvent(new Event('error'));
    await nextTick();
    expect(wrapper.find('.semi-videoPlayer-error').exists()).toBe(true);
    expect(wrapper.find('.semi-videoPlayer-pause').exists()).toBe(false);
  });

  it('进度与章节拖动写入 currentTime，键盘只在播放器内聚焦时响应', async () => {
    const wrapper = mountPlayer({
      markers: [
        { start: 0, title: 'Intro' },
        { start: 50, title: 'End' },
      ],
    });
    const video = media(wrapper);
    defineMediaNumber(video, 'duration', 100);
    video.dispatchEvent(new Event('durationchange'));
    await nextTick();
    const progress = wrapper.get('.semi-videoPlayer-progress');
    vi.spyOn(progress.element, 'getBoundingClientRect').mockReturnValue({
      bottom: 20,
      height: 20,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    await progress.trigger('mousedown', { clientX: 50 });
    expect(video.currentTime).toBe(25);
    expect(wrapper.findAll('.semi-videoPlayer-progress-slider')).toHaveLength(2);

    defineMediaNumber(video, 'currentTime', 20);
    video.dispatchEvent(new Event('timeupdate'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(video.currentTime).toBe(20);
    (wrapper.get('.semi-videoPlayer-controls-menu-button').element as HTMLElement).focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(video.currentTime).toBe(30);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(video.currentTime).toBe(20);
  });

  it('同步音量、静音、倍速、清晰度、线路、镜像与临时通知', async () => {
    vi.useFakeTimers();
    const wrapper = mountPlayer(
      {
        defaultQuality: '1080p',
        defaultRoute: 'line-1',
        qualityList: [
          { label: '480p', value: '480p' },
          { label: '1080p', value: '1080p' },
        ],
        routeList: [
          { label: '线路一', value: 'line-1' },
          { label: '线路二', value: 'line-2' },
        ],
      },
      { portals: true },
    );
    const video = media(wrapper);
    await wrapper
      .findAll('.semi-dropdown-item')
      .find((item) => item.text() === '1.5x')!
      .trigger('mousedown', { button: 0 });
    expect(video.playbackRate).toBe(1.5);
    expect(wrapper.emitted('rateChange')?.[0]).toEqual([1.5]);
    expect(wrapper.text()).toContain('切换速率至 1.5x');

    await wrapper
      .findAll('.semi-dropdown-item')
      .find((item) => item.text() === '480p')!
      .trigger('mousedown', { button: 0 });
    await wrapper
      .findAll('.semi-dropdown-item')
      .find((item) => item.text() === '线路二')!
      .trigger('mousedown', { button: 0 });
    expect(wrapper.emitted('qualityChange')?.[0]).toEqual(['480p']);
    expect(wrapper.emitted('routeChange')?.[0]).toEqual(['line-2']);

    await wrapper.get('.semi-icon-flip_horizontal').element.closest('button')?.click();
    await nextTick();
    expect(wrapper.classes()).toContain('semi-videoPlayer-mirror');
    expect(wrapper.text()).toContain('镜像');

    const muteButton = wrapper.get('.semi-icon-volume_2').element.closest('button');
    muteButton?.click();
    await nextTick();
    expect(video.volume).toBe(0);
    expect(wrapper.emitted('volumeChange')?.at(-1)).toEqual([0]);
    expect(wrapper.find('.semi-icon-mute').exists()).toBe(true);

    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.find('.semi-videoPlayer-notification').exists()).toBe(false);
    wrapper.unmount();
    vi.useRealTimers();
  });

  it('处理 waiting/canplay、无资源与 en-US 错误文案', async () => {
    const wrapper = mountPlayer({}, { locale: enUS, portals: true });
    const video = media(wrapper);
    video.dispatchEvent(new Event('waiting'));
    await nextTick();
    expect(wrapper.text()).toContain('Loading...');
    video.dispatchEvent(new Event('canplay'));
    await nextTick();
    expect(wrapper.find('.semi-videoPlayer-notification').exists()).toBe(false);
    video.dispatchEvent(new Event('error'));
    await nextTick();
    expect(wrapper.text()).toContain('Video load error');

    expect(mountPlayer({ src: undefined }, { locale: enUS }).text()).toContain('No resource');
  });

  it('使用相同全局与媒体监听引用初始化和销毁', () => {
    const documentAdd = vi.spyOn(document, 'addEventListener');
    const documentRemove = vi.spyOn(document, 'removeEventListener');
    const mediaAdd = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const mediaRemove = vi.spyOn(HTMLMediaElement.prototype, 'removeEventListener');
    const wrapper = mountPlayer();
    const keydownAdd = documentAdd.mock.calls.find(([name]) => name === 'keydown');
    const fullscreenAdd = documentAdd.mock.calls.find(([name]) => name === 'fullscreenchange');
    const pipAdd = mediaAdd.mock.calls.find(([name]) => name === 'leavepictureinpicture');
    wrapper.unmount();
    const keydownRemove = documentRemove.mock.calls.find(([name]) => name === 'keydown');
    const fullscreenRemove = documentRemove.mock.calls.find(
      ([name]) => name === 'fullscreenchange',
    );
    const pipRemove = mediaRemove.mock.calls.find(([name]) => name === 'leavepictureinpicture');
    expect(keydownRemove?.[1]).toBe(keydownAdd?.[1]);
    expect(fullscreenRemove?.[1]).toBe(fullscreenAdd?.[1]);
    expect(pipRemove?.[1]).toBe(pipAdd?.[1]);
  });

  it('formatVideoTime 保留固定格式', () => {
    expect(formatVideoTime(0)).toBe('00:00');
    expect(formatVideoTime(65.9)).toBe('01:05');
    expect(formatVideoTime(3661)).toBe('1:01:01');
    expect(formatVideoTime(Number.NaN)).toBe('00:00');
  });
});
