/* eslint-disable vue/one-component-per-file -- local passthrough hosts expose Portal slot contracts. */
import { mount, type VueWrapper } from '@vue/test-utils';
import { computed, defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  configContextKey,
  DEFAULT_CONFIG_LOCALE,
  semiGlobal,
  type ConfigContextValue,
} from '../config-provider';
import enUS from '../locale/source/en_US';
import AudioPlayer from './AudioPlayer.vue';

const Passthrough = defineComponent({
  template: '<div><slot /><slot name="content" /></div>',
});
const TooltipPassthrough = defineComponent({ template: '<slot />' });

function mountPlayer(
  props: Record<string, unknown> = {},
  options: { portals?: boolean; locale?: ConfigContextValue['locale'] } = {},
): VueWrapper {
  const provide = options.locale
    ? {
        [configContextKey as symbol]: computed(
          () =>
            ({
              direction: 'ltr',
              locale: options.locale,
            }) as ConfigContextValue,
        ),
      }
    : undefined;
  return mount(AudioPlayer, {
    attrs: { 'data-player': 'unit' },
    props: { audioUrl: '/audio/one.mp3', ...props },
    global: {
      ...(provide === undefined ? {} : { provide }),
      ...(options.portals
        ? { stubs: { Dropdown: Passthrough, Popover: Passthrough, Tooltip: TooltipPassthrough } }
        : {}),
    },
  });
}

function media(wrapper: VueWrapper): HTMLAudioElement {
  return wrapper.get('audio').element as HTMLAudioElement;
}

function defineDuration(audio: HTMLAudioElement, duration: number): void {
  Object.defineProperty(audio, 'duration', { configurable: true, value: duration });
}

function buttonForIcon(wrapper: VueWrapper, iconClass: string): HTMLButtonElement {
  const button = wrapper.get(`.${iconClass}`).element.closest('button');
  if (!(button instanceof HTMLButtonElement)) throw new Error(`No button for ${iconClass}`);
  return button;
}

beforeEach(() => {
  semiGlobal.config = {};
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
});

afterEach(() => {
  semiGlobal.config = {};
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('AudioPlayer', () => {
  it('区分 showToolbar 缺省、显式 false、显式 true 与全局覆盖', () => {
    expect(mountPlayer().findAll(':scope > .semi-audio-player-control')).toHaveLength(2);
    expect(
      mountPlayer({ showToolbar: false }).findAll(':scope > .semi-audio-player-control'),
    ).toHaveLength(1);
    expect(
      mountPlayer({ showToolbar: true }).findAll(':scope > .semi-audio-player-control'),
    ).toHaveLength(2);

    semiGlobal.config.overrideDefaultProps = { AudioPlayer: { showToolbar: false } };
    expect(mountPlayer().findAll(':scope > .semi-audio-player-control')).toHaveLength(1);
    expect(
      mountPlayer({ showToolbar: true }).findAll(':scope > .semi-audio-player-control'),
    ).toHaveLength(2);
  });

  it('归一化 string、AudioInfo 与混合数组并循环切换曲目', async () => {
    const object = mountPlayer({
      audioUrl: { cover: '/cover.webp', src: '/audio/object.mp3', title: 'Object title' },
    });
    expect(media(object).getAttribute('src')).toBe('/audio/object.mp3');
    expect(object.text()).toContain('Object title');
    expect(object.find('.semi-image').exists()).toBe(true);

    const playlist = mountPlayer({
      audioUrl: ['/audio/one.mp3', { src: '/audio/two.mp3', title: 'Second title' }],
    });
    expect(playlist.findAll(':scope > .semi-audio-player-control button')).toHaveLength(7);
    playlist.get('.semi-icon-restart[style*="rotate(180deg)"]').element.closest('button')?.click();
    await nextTick();
    expect(media(playlist).getAttribute('src')).toBe('/audio/two.mp3');
    expect(playlist.text()).toContain('Second title');

    media(playlist).dispatchEvent(new Event('ended'));
    await nextTick();
    expect(media(playlist).getAttribute('src')).toBe('/audio/one.mp3');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
  });

  it('按 metadata、timeupdate、play/pause 与 ended 同步可见状态', async () => {
    const wrapper = mountPlayer(
      { audioUrl: { src: '/audio/one.mp3', title: 'Track' } },
      { portals: true },
    );
    const audio = media(wrapper);
    defineDuration(audio, 125);
    audio.volume = 0.42;
    audio.playbackRate = 1.5;
    audio.dispatchEvent(new Event('loadedmetadata'));
    await nextTick();
    expect(wrapper.text()).toContain('2:05');
    expect(wrapper.text()).toContain('42%');
    expect(wrapper.text()).toContain('1.0x');

    audio.currentTime = 61;
    audio.dispatchEvent(new Event('timeupdate'));
    await nextTick();
    expect(wrapper.text()).toContain('1:01');

    await wrapper.get('.semi-audio-player-control-button-play').trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
    expect(wrapper.find('.semi-icon-pause').exists()).toBe(true);
    await wrapper.get('.semi-audio-player-control-button-play').trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
    expect(wrapper.find('.semi-icon-play').exists()).toBe(true);

    await wrapper.get('.semi-audio-player-control-button-play').trigger('click');
    audio.dispatchEvent(new Event('ended'));
    await nextTick();
    expect(wrapper.find('.semi-icon-play').exists()).toBe(true);
  });

  it('夹紧 seek、同步 rate/volume、切换静音并刷新', async () => {
    const wrapper = mountPlayer({ skipDuration: 15 }, { portals: true });
    const audio = media(wrapper);
    defineDuration(audio, 100);
    audio.currentTime = 95;

    buttonForIcon(wrapper, 'semi-icon-fast_forward').click();
    expect(audio.currentTime).toBe(100);
    buttonForIcon(wrapper, 'semi-icon-backward').click();
    expect(audio.currentTime).toBe(85);

    await wrapper
      .findAll('.semi-dropdown-item')
      .find((item) => item.text() === '1.5x')!
      .trigger('mousedown', { button: 0 });
    expect(audio.playbackRate).toBe(1.5);
    expect(wrapper.text()).toContain('1.5x');

    const verticalSlider = wrapper.get('.semi-audio-player-slider-wrapper-vertical');
    const sliderElement = verticalSlider.get('.semi-audio-player-slider').element;
    vi.spyOn(sliderElement, 'getBoundingClientRect').mockReturnValue({
      bottom: 120,
      height: 120,
      left: 0,
      right: 4,
      top: 0,
      width: 4,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    await verticalSlider.trigger('mousedown', { clientY: 30 });
    expect(audio.volume).toBe(0.75);
    expect(wrapper.text()).toContain('75%');

    buttonForIcon(wrapper, 'semi-icon-volume_2').click();
    await nextTick();
    expect(audio.volume).toBe(0);
    expect(wrapper.find('.semi-icon-volumn_silent').exists()).toBe(true);
    buttonForIcon(wrapper, 'semi-icon-volumn_silent').click();
    await nextTick();
    expect(audio.volume).toBe(0.5);

    audio.currentTime = 20;
    audio.dispatchEvent(new Event('timeupdate'));
    buttonForIcon(wrapper, 'semi-icon-refresh').click();
    await nextTick();
    expect(audio.currentTime).toBe(0);
    expect(wrapper.text()).toContain('0:00');
  });

  it('错误态禁用播放、显示 Locale 文案并通过 load 重试', async () => {
    const wrapper = mountPlayer(
      { audioUrl: { src: '/broken.mp3', title: 'Broken' } },
      { portals: true, locale: enUS },
    );
    const audio = media(wrapper);
    audio.dispatchEvent(new Event('error'));
    await nextTick();

    expect(wrapper.text()).toContain('Audio load error');
    expect(wrapper.get('.semi-audio-player-control-button-play').attributes('disabled')).toBe('');
    expect(wrapper.find('.semi-audio-player-info-time').exists()).toBe(false);
    buttonForIcon(wrapper, 'semi-icon-refresh').click();
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalledOnce();

    defineDuration(audio, 10);
    audio.dispatchEvent(new Event('loadedmetadata'));
    await nextTick();
    expect(wrapper.find('.semi-audio-player-info-time').exists()).toBe(true);
  });

  it('更新 audioUrl 时修正越界索引并重置时间、速率和错误', async () => {
    const wrapper = mountPlayer({ audioUrl: ['/one.mp3', '/two.mp3'] }, { portals: true });
    wrapper.get('.semi-icon-restart[style*="rotate(180deg)"]').element.closest('button')?.click();
    await nextTick();
    const audio = media(wrapper);
    audio.currentTime = 12;
    audio.dispatchEvent(new Event('timeupdate'));
    audio.dispatchEvent(new Event('error'));
    await wrapper.setProps({ audioUrl: ['/replacement.mp3'] });

    expect(audio.getAttribute('src')).toBe('/replacement.mp3');
    expect(wrapper.text()).toContain('0:00');
    expect(wrapper.find('.semi-audio-player-error').exists()).toBe(false);
  });

  it('使用相同监听函数引用初始化和销毁并透传根 attrs', () => {
    const add = vi.spyOn(HTMLMediaElement.prototype, 'addEventListener');
    const remove = vi.spyOn(HTMLMediaElement.prototype, 'removeEventListener');
    const wrapper = mountPlayer({ className: 'named', style: { width: '640px' } });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-audio-player', 'named']));
    expect(wrapper.attributes('data-player')).toBe('unit');
    expect((wrapper.element as HTMLElement).style.width).toBe('640px');
    const mediaAdds = add.mock.calls.filter(([name]) =>
      ['loadedmetadata', 'error', 'ended'].includes(String(name)),
    );
    wrapper.unmount();
    const mediaRemoves = remove.mock.calls.filter(([name]) =>
      ['loadedmetadata', 'error', 'ended'].includes(String(name)),
    );
    expect(mediaAdds).toHaveLength(3);
    expect(mediaRemoves).toHaveLength(3);
    for (const [index, addCall] of mediaAdds.entries()) {
      expect(mediaRemoves[index]?.[0]).toBe(addCall[0]);
      expect(mediaRemoves[index]?.[1]).toBe(addCall[1]);
    }
  });

  it('formatAudioTime 对非法值稳定回退', async () => {
    const { formatAudioTime } = await import('./utils');
    expect(formatAudioTime(0)).toBe('0:00');
    expect(formatAudioTime(65.9)).toBe('1:05');
    expect(formatAudioTime(Number.NaN)).toBe('0:00');
    expect(formatAudioTime(-1)).toBe('0:00');
    expect(DEFAULT_CONFIG_LOCALE.code).toBe('zh-CN');
  });
});
