/** Ignore commented-out examples while preserving source offsets for the coverage ledger. */
export function upstreamLiveDemos(source) {
  const visible = source.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\r\n]/g, ' '));
  return [...visible.matchAll(/^[ \t]{0,3}(`{3,})([^\n]*)\n([\s\S]*?)^[ \t]{0,3}\1[ \t]*$/gm)]
    .filter((match) => /\blive\s*=\s*(?:true\b|"true"|'true')/.test(match[2]))
    .map((match) => ({
      index: match.index,
      line: source.slice(0, match.index).split('\n').length,
      header: match[2].trim(),
      code: match[3],
    }));
}
