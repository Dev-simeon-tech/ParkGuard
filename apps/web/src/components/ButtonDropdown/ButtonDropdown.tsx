import { ReactNode } from 'react';
import { Button } from '@/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { cn } from '@/utils/cn';

export type ButtonDropdownItem = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

export type ButtonDropdownProps = {
  items: ButtonDropdownItem[];
  triggerLabel?: ReactNode;
  buttonVariantType?: 'outline' | 'primary' | 'secondary' | 'destructive' | null | undefined;
};

export function ButtonDropdown({
  items,
  triggerLabel = 'Actions',
  buttonVariantType = 'outline',
}: ButtonDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariantType} size="sm">
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={item.onClick}
            className={cn(item.destructive && 'text-red-600')}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
