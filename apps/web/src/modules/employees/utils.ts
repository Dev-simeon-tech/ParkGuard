export function formatRoleName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const roleBadgeVariants: Record<string, string> = {
  attendant: 'bg-blue-400',
  manager: 'bg-green-400',
  admin: 'bg-black',
};
