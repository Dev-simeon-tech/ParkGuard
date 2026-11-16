import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/TestProvider';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its children', () => {
    const { getByRole } = renderWithProviders(<Button>Click me</Button>);
    expect(getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithProviders(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when the disabled prop is set', () => {
    const { getByRole } = renderWithProviders(<Button disabled>Click me</Button>);
    expect(getByRole('button')).toBeDisabled();
  });
});
