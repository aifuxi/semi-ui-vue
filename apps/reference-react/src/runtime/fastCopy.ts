export default function copy<Value>(value: Value): Value {
  if (Array.isArray(value)) return [...value] as Value;
  if (value instanceof Map) return new Map(value) as Value;
  if (value instanceof Set) return new Set(value) as Value;
  if (value && typeof value === 'object') return { ...value } as Value;
  return value;
}
