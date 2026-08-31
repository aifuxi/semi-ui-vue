export function formatAudioTime(time: number | undefined): string {
  const normalized = Number.isFinite(time) && (time ?? 0) >= 0 ? (time ?? 0) : 0;
  const minutes = Math.floor(normalized / 60);
  const seconds = Math.floor(normalized % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
