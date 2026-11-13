import { Card } from './Card';
import { Layout } from './Layout';

type VerificationEmailProps = {
  verificationUrl: string;
};

export function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Layout preview="Verify your ParkGuard email address">
      <Card.Container>
        <Card.Heading>Verify your email</Card.Heading>
        <Card.Text>Click the button below to verify your email address.</Card.Text>
        <Card.Button href={verificationUrl}>Verify email</Card.Button>
        <Card.Text>
          This link expires in 24 hours. If you didn't create a ParkGuard account, you can ignore
          this email.
        </Card.Text>
      </Card.Container>
    </Layout>
  );
}
