import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const HOT_KEYS = {
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Space: ' ',
  Enter: 'enter',
  Escape: 'escape',
  Backspace: 'backspace',
  Tab: 'tab',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Backquote: '`',
  Comma: ',',
  Period: '.',
  Slash: '/',
  Exclamation: '!',
  At: '@',
  Hash: '#',
  Dollar: '$',
  Percent: '%',
  Caret: '^',
  Ampersand: '&',
  Asterisk: '*',
  LeftParenthesis: '(',
  RightParenthesis: ')',
  ArrowUp: 'arrowup',
  ArrowDown: 'arrowdown',
  ArrowLeft: 'arrowleft',
  ArrowRight: 'arrowright',
  Shift: 'shift',
  Control: 'control',
  Alt: 'alt',
  Meta: 'meta',
  CapsLock: 'capslock',
  F1: 'f1',
  F2: 'f2',
  F3: 'f3',
  F4: 'f4',
  F5: 'f5',
  F6: 'f6',
  F7: 'f7',
  F8: 'f8',
  F9: 'f9',
  F10: 'f10',
  F11: 'f11',
  F12: 'f12',
  Insert: 'insert',
  Delete: 'delete',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  NumLock: 'numlock',
  ScrollLock: 'scrolllock',
  Pause: 'pause',
  Numpad0: 'numpad0',
  Numpad1: 'numpad1',
  Numpad2: 'numpad2',
  Numpad3: 'numpad3',
  Numpad4: 'numpad4',
  Numpad5: 'numpad5',
  Numpad6: 'numpad6',
  Numpad7: 'numpad7',
  Numpad8: 'numpad8',
  Numpad9: 'numpad9',
  NumpadDecimal: 'numpaddecimal',
  NumpadDivide: 'numpaddivide',
  NumpadMultiply: 'numpadmultiply',
  NumpadSubtract: 'numpadsubtract',
  NumpadAdd: 'numpadadd',
  NumpadEnter: 'numpadenter',
} as const;

export type HotKeysKey = KeyboardEvent['key'];

export interface HotKeysProps {
  hotKeys: HotKeysKey[];
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  content?: string[];
  getListenerTarget?: () => HTMLElement | null | undefined;
  mergeMetaCtrl?: boolean;
  preventDefault?: boolean;
  style?: StyleValue;
}

export interface HotKeysEmits {
  click: [event: MouseEvent];
  hotKey: [event: KeyboardEvent];
}

export interface HotKeysSlots {
  default?: () => VNodeChild;
}
