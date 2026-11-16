import { zodResolver } from '@hookform/resolvers/zod';
import type { ForgotPasswordBody } from '@parkguard/schemas';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { InfoCard } from '@/components/InfoCard';
import { Input } from '@/components/Input';
import { useForgotPassword } from '../api/forgotPassword';
import { ForgotPasswordBodySchema } from '../schemas';

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordBody>({
    resolver: zodResolver(ForgotPasswordBodySchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordBody) => {
    await forgotPasswordMutation.mutateAsync(values);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <InfoCard
        title="Check your email"
        subtitle="If an account with that email exists, a password reset link has been sent."
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl focus-visible:ring-secondary"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </Form>
  );
}
