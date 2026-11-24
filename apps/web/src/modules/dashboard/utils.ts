export function metricTone(color: string) {
  const tones: Record<string, string> = {
    teal: 'bg-[#e6f4f1] text-secondary',
    blue: 'bg-[#eaf0f5] text-[#55758f]',
    green: 'bg-[#edf2e9] text-[#668052]',
    violet: 'bg-[#f0ebf3] text-[#826b91]',
  };
  return tones[color] ?? tones.teal;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
