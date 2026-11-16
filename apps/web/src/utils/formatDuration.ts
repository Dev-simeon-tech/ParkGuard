export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 0 || !Number.isFinite(totalMinutes)) return '—';

  const minutes = Math.round(totalMinutes);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}hr${hours > 1 ? 's' : ''}`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}min${mins !== 1 ? 's' : ''}`);

  return parts.join(' ');
}
