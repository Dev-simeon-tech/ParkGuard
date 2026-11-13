import { Card } from './Card';
import { Layout } from './Layout';

type InviteEmailProps = {
  organizationName: string;
  inviteUrl: string;
};

export function InviteEmail({ organizationName, inviteUrl }: InviteEmailProps) {
  return (
    <Layout preview={`You've been invited to join ${organizationName} on ParkGuard`}>
      <Card.Container>
        <Card.Heading>You're invited</Card.Heading>
        <Card.Text>
          You've been invited to join <strong>{organizationName}</strong> on ParkGuard.
        </Card.Text>
        <Card.Button href={inviteUrl}>Accept invite</Card.Button>
        <Card.Text>This link expires in 7 days.</Card.Text>
      </Card.Container>
    </Layout>
  );
}
