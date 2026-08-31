import type { Locale as DateFnsLocale } from 'date-fns';
import type { VNodeChild } from 'vue';

import type { SemiLocale } from '../config-provider';

export interface LocaleProviderProps {
  locale?: Readonly<SemiLocale>;
}

export interface LocaleProviderSlots {
  default?: () => VNodeChild;
}

export interface LocaleConsumerProps {
  componentName: string;
}

export interface LocaleConsumerSlotProps<ComponentLocale = unknown> {
  localeData: ComponentLocale;
  localeCode: string;
  dateFnsLocale: DateFnsLocale;
  currency: string | undefined;
}

export interface LocaleConsumerSlots<ComponentLocale = unknown> {
  default?: (props: LocaleConsumerSlotProps<ComponentLocale>) => VNodeChild;
}
