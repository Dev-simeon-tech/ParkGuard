import type { CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'base' | 'sm';

export const colors = {
  black: '#111827',
  white: '#ffffff',
  gray: '#6b7280',
  border: '#e5e7eb',
};

export const fontSizes = {
  xs: '11px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '24px',
};

const buttonVariants: Record<ButtonVariant, CSSProperties> = {
  primary: { color: colors.white, background: colors.black },
  secondary: {
    color: colors.black,
    background: colors.white,
    borderColor: colors.black,
    border: `1px solid ${colors.black}`,
  },
};

const buttonSizes: Record<ButtonSize, CSSProperties> = {
  base: { padding: '12px 24px', margin: '30px auto' },
  sm: { padding: '5px 10px', margin: '5px 0' },
};

export const styles = {
  container: { margin: '0 auto', padding: '0 48px' },
  card: (props: CSSProperties = {}): CSSProperties => ({
    background: colors.white,
    margin: '0 auto',
    padding: '20px 30px',
    borderRadius: '8px',
    marginBottom: '20px',
    ...props,
  }),
  paragraph: (props: CSSProperties = {}): CSSProperties => ({
    fontSize: fontSizes.base,
    lineHeight: '24px',
    color: colors.black,
    marginBottom: '16px',
    ...props,
  }),
  heading: (props: CSSProperties = {}): CSSProperties => ({
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: '20px',
    ...props,
  }),
  button: (
    props: { variant?: ButtonVariant; size?: ButtonSize; style?: CSSProperties } = {},
  ): CSSProperties => {
    const { variant = 'primary', size = 'base', ...rest } = props;
    return {
      borderRadius: '4px',
      fontSize: fontSizes.base,
      fontWeight: 'bold',
      textDecoration: 'none',
      textAlign: 'center',
      display: 'block',
      width: 'fit-content',
      ...buttonVariants[variant],
      ...buttonSizes[size],
      ...rest,
    };
  },
  hr: { borderColor: colors.border, margin: '30px 0' },
} as const;
