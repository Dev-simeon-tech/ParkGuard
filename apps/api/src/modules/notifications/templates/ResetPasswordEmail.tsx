import { Card } from './Card';
import { Layout } from './Layout';

type ResetPasswordEmailProps = {
  resetUrl: string;
};

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Layout preview="Reset your ParkGuard password">
      <Card.Container>
        <Card.Heading>Reset your password</Card.Heading>
        <Card.Text>Click the button below to choose a new password.</Card.Text>
        <Card.Button href={resetUrl}>Reset password</Card.Button>
        <Card.Text>
          This link expires in 1 hour. If you didn't request a password reset, you can ignore this
          email.
        </Card.Text>
      </Card.Container>
    </Layout>
  );
}
