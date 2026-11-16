import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { useAcceptInvite } from '../api/acceptInvite';
import { AcceptInviteBodySchema } from '../schemas';

const AcceptInviteFormSchema = AcceptInviteBodySchema.pick({ password: true });
type AcceptInviteFormValues = { password: string };

export type AcceptInviteFormProps = {
  token: string;
  email: string;
  organizationName: string;
  onSuccess: () => void;
};

export function AcceptInviteForm({
  token,
  email,
  organizationName,
  onSuccess,
}: AcceptInviteFormProps) {
  const acceptInviteMutation = useAcceptInvite();

  const form = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(AcceptInviteFormSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (values: AcceptInviteFormValues) => {
    await acceptInviteMutation.mutateAsync({ token, password: values.password });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-center text-neutral-500">
          Join {organizationName} as {email}. Choose a password to finish setting up your account.
        </p>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={acceptInviteMutation.isPending}>
          {acceptInviteMutation.isPending ? 'Joining…' : 'Join organization'}
        </Button>
      </form>
    </Form>
  );
}
