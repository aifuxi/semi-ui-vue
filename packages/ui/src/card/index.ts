import type { DefineComponent } from 'vue';

import CardBase from './Card.vue';
import CardGroupBase from './CardGroup.vue';
import CardMetaBase from './CardMeta.vue';
import type { CardGroupProps, CardMetaProps, CardProps } from './types';

export type CardCompoundComponent = DefineComponent<CardProps> & {
  Meta: DefineComponent<CardMetaProps>;
};

export const CardGroup = CardGroupBase as unknown as DefineComponent<CardGroupProps>;
export const CardMeta = CardMetaBase as unknown as DefineComponent<CardMetaProps>;
export const Card = Object.assign(CardBase, { Meta: CardMeta }) as unknown as CardCompoundComponent;

export { CARD_GROUP_TYPES, CARD_SHADOWS } from './types';
export type {
  CardGroupProps,
  CardGroupSlots,
  CardGroupType,
  CardMetaProps,
  CardMetaSlots,
  CardProps,
  CardShadows,
  CardSlots,
} from './types';

export default Card;
