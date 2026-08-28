import React from 'react';

interface HighlightSearchWord {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface SemiHighlightStubProps {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  component?: string;
  highlightClassName?: string;
  highlightStyle?: React.CSSProperties;
  searchWords?: Array<string | HighlightSearchWord>;
  sourceString?: string;
}

interface HighlightRange {
  start: number;
  end: number;
  className: string | undefined;
  style: React.CSSProperties | undefined;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function SemiHighlightStub({
  autoEscape = true,
  caseSensitive = false,
  component = 'mark',
  highlightClassName,
  highlightStyle,
  searchWords = [],
  sourceString = '',
}: SemiHighlightStubProps): React.ReactElement {
  const ranges = searchWords
    .map((word) => (typeof word === 'string' ? { text: word } : word))
    .filter((word) => word.text)
    .flatMap((word) => {
      const expression = autoEscape ? escapeRegExp(word.text) : word.text;
      const regex = new RegExp(expression, caseSensitive ? 'g' : 'gi');
      return [...sourceString.matchAll(regex)].map((match) => ({
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        className: word.className,
        style: word.style,
      }));
    })
    .sort((first, second) => first.start - second.start)
    .reduce<HighlightRange[]>((merged, range) => {
      const previous = merged[merged.length - 1];
      if (!previous || range.start > previous.end) return [...merged, range];
      previous.end = Math.max(previous.end, range.end);
      previous.className ||= range.className;
      previous.style = { ...previous.style, ...range.style };
      return merged;
    }, []);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.start > cursor) nodes.push(sourceString.slice(cursor, range.start));
    nodes.push(
      React.createElement(
        component,
        {
          className: ['semi-highlight-tag', highlightClassName, range.className]
            .filter(Boolean)
            .join(' '),
          key: `${range.start}:${index}`,
          style: { ...highlightStyle, ...range.style },
        },
        sourceString.slice(range.start, range.end),
      ),
    );
    cursor = range.end;
  });
  if (cursor < sourceString.length) nodes.push(sourceString.slice(cursor));

  return <>{nodes}</>;
}
