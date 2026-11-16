import { Button, Heading, Hr, Section, Text } from '@react-email/components';
import type { CSSProperties, PropsWithChildren } from 'react';
import type { ButtonSize, ButtonVariant } from './styles';
import { colors, fontSizes, styles } from './styles';

function Container({ children }: PropsWithChildren) {
  return <Section style={styles.container}>{children}</Section>;
}

function CardHeading({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) {
  return <Heading style={styles.heading(style)}>{children}</Heading>;
}

function CardText({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) {
  return <Text style={styles.paragraph(style)}>{children}</Text>;
}

type CardButtonProps = PropsWithChildren<{
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
}>;

function CardButton({ children, href, variant, size, style }: CardButtonProps) {
  return (
    <Button href={href} style={styles.button({ variant, size, style })}>
      {children}
    </Button>
  );
}

function CardHr() {
  return <Hr style={styles.hr} />;
}

function Footer({ children }: PropsWithChildren) {
  return (
    <Text style={{ textAlign: 'center', color: colors.gray, fontSize: fontSizes.sm }}>
      {children}
    </Text>
  );
}

export const Card = {
  Container,
  Heading: CardHeading,
  Text: CardText,
  Button: CardButton,
  Hr: CardHr,
  Footer,
};
