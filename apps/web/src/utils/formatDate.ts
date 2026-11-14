export function formatDateTime(isoString: string): { day: string; time: string } {
  const date = new Date(isoString);
  const now = new Date();

  // Start of the current week (Sunday, local time)
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // exclusive upper bound

  const isCurrentWeek = date >= startOfWeek && date < endOfWeek;

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const day = isToday
    ? 'Today'
    : isCurrentWeek
      ? date.toLocaleDateString('en-US', { weekday: 'short' }) // "Tue"
      : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }); // "Sep 7"

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }); // "10:56 PM"

  return { day, time };
}
