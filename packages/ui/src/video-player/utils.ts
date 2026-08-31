export function formatVideoTime(time: number): string {
  if (Number.isNaN(time)) return '00:00';
  const hours = Math.floor(time / 3600);
  if (hours > 0) {
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
