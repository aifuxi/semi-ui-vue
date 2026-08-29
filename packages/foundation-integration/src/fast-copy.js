// The pinned Foundation only needs shallow copies of arrays, maps, sets and plain records here.
export default function copy(value) {
  if (Array.isArray(value)) return [...value];
  if (value instanceof Map) return new Map(value);
  if (value instanceof Set) return new Set(value);
  if (value && typeof value === 'object') return { ...value };
  return value;
}
