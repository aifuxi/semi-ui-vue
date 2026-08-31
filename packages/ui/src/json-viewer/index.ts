import type { ComponentOptionsMixin, DefineComponent } from 'vue';

import JsonViewerBase from './JsonViewer.vue';
import type { JsonViewerEmits, JsonViewerExposed, JsonViewerProps } from './types';

type JsonViewerComponentEmits = {
  [EventName in keyof JsonViewerEmits]: (...args: JsonViewerEmits[EventName]) => void;
};
type EmptyComponentOptions = Record<never, never>;

export type JsonViewerComponent = DefineComponent<
  JsonViewerProps,
  JsonViewerExposed,
  EmptyComponentOptions,
  EmptyComponentOptions,
  EmptyComponentOptions,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  JsonViewerComponentEmits
>;
export const JsonViewer = JsonViewerBase as unknown as JsonViewerComponent;
export default JsonViewer;
export type {
  JsonViewerCompletionItem,
  JsonViewerCustomRenderRule,
  JsonViewerEmits,
  JsonViewerExposed,
  JsonViewerFormattingOptions,
  JsonViewerLocale,
  JsonViewerOptions,
  JsonViewerProps,
  JsonViewerSearchControls,
  JsonViewerSearchResult,
  JsonViewerSlots,
  JsonViewerTokenRenderType,
} from './types';
