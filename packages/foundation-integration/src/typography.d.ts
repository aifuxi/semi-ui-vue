export type TypographyNumeralRule =
  'text' | 'numbers' | 'bytes-decimal' | 'bytes-binary' | 'percentages' | 'exponential';

export type TypographyNumeralTruncate = 'ceil' | 'floor' | 'round';

export class FormatNumeral {
  constructor(
    content: string,
    rule: TypographyNumeralRule,
    precision: number,
    truncate: TypographyNumeralTruncate,
    parser?: (value: string) => string,
  );
  format(): string;
}
