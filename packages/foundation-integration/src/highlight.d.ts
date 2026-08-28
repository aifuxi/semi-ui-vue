export interface HighlightFoundationSearchWord {
  text: string;
  className?: string;
  style?: Record<string, string | number>;
}

export type HighlightFoundationSearchWords = Array<
  string | HighlightFoundationSearchWord | undefined
>;

export interface HighlightFoundationChunk {
  start: number;
  end: number;
  highlight: boolean;
  className?: string;
  style?: Record<string, string | number>;
}

export interface HighlightFoundationQuery {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  searchWords: HighlightFoundationSearchWords;
  sourceString: string;
}

export class HighlightFoundation {
  findAll(query: HighlightFoundationQuery): HighlightFoundationChunk[];
}
