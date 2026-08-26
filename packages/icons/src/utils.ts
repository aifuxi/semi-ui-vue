import type { IconFill } from './components/Icon';

const DEFAULT_TWO_COLOR = ['rgba(166,71,255)', 'currentColor'] as const;
const DEFAULT_FOUR_COLOR = [
  'rgba(233,69,255)',
  'rgba(166,71,255)',
  'rgba(107,97,255)',
  'rgba(46,140,255)',
] as const;

export function getFillColor(fill: IconFill | undefined, count: number): string[] {
  if (typeof fill === 'string') return Array.from({ length: count }, () => fill);

  if (Array.isArray(fill) && fill.length > 0) {
    const colors = Array.from({ length: count }, (_, index) => fill[index % fill.length]!);
    return count === 4 ? colors.reverse() : colors;
  }

  return [...(count === 2 ? DEFAULT_TWO_COLOR : DEFAULT_FOUR_COLOR)];
}

export function getUuidShort(options: { prefix?: string; length?: number } = {}): string {
  const { prefix = '', length = 7 } = options;
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
  const value = Array.from(
    { length },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('');
  return prefix ? `${prefix}-${value}` : value;
}
