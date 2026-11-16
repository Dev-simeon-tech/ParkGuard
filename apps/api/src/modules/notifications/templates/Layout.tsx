import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';
import type { PropsWithChildren } from 'react';
import { colors, fontSizes } from './styles';

type LayoutProps = PropsWithChildren<{
  preview: string;
}>;

export function Layout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#f6f6f6', fontFamily: 'sans-serif' }}>
        <Container
          style={{
            backgroundColor: colors.white,
            margin: '0 auto',
            padding: '20px 0 48px',
            marginBottom: '35px',
            maxWidth: '600px',
          }}
        >
          {children}
        </Container>
        <Text style={{ textAlign: 'center', fontSize: fontSizes.sm, color: colors.gray }}>
          © {new Date().getFullYear()} ParkGuard. All rights reserved.
        </Text>
      </Body>
    </Html>
  );
}
