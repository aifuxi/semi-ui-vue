import TypographyBase from './Typography.vue';
import Numeral from './Numeral.vue';
import Paragraph from './Paragraph.vue';
import Text from './Text.vue';
import Title from './Title.vue';

export type TypographyCompoundComponent = typeof TypographyBase & {
  Text: typeof Text;
  Title: typeof Title;
  Paragraph: typeof Paragraph;
  Numeral: typeof Numeral;
};

export const Typography = Object.assign(TypographyBase, {
  Text,
  Title,
  Paragraph,
  Numeral,
}) as TypographyCompoundComponent;

export { Numeral, Paragraph, Text, Title };
export {
  DEFAULT_TYPOGRAPHY_LOCALE,
  EN_US_TYPOGRAPHY_LOCALE,
  typographyLocaleKey,
} from './typography-locale';
export {
  TYPOGRAPHY_HEADINGS,
  TYPOGRAPHY_NUMERAL_RULES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_SPACINGS,
  TYPOGRAPHY_TRUNCATE_MODES,
  TYPOGRAPHY_TYPES,
  TYPOGRAPHY_WEIGHTS,
} from './types';
export type {
  NumeralProps,
  ParagraphProps,
  TextProps,
  TitleProps,
  TypographyBaseProps,
  TypographyComponent,
  TypographyContentSlots,
  TypographyCopyableConfig,
  TypographyEllipsis,
  TypographyEmits,
  TypographyHeading,
  TypographyLink,
  TypographyLocale,
  TypographyNumeralRule,
  TypographyProps,
  TypographyShowTooltip,
  TypographySize,
  TypographySlots,
  TypographySpacing,
  TypographyTruncate,
  TypographyType,
  TypographyWeight,
} from './types';

export default Typography;
