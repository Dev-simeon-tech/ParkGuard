import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { useResetPassword } from '../api/resetPassword';
import { ResetPasswordBodySchema } from '../schemas';

const ResetPasswordFormSchema = ResetPasswordBodySchema.pick({ password: true });
type ResetPasswordFormValues = { password: string };

export type ResetPasswordFormProps = {
  token: string;
  email: string;
  onSuccess: () => void;
};

export function ResetPasswordForm({ token, email, onSuccess }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    await resetPasswordMutation.mutateAsync({ token, password: values.password });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-neutral-500">Choose a new password for {email}.</p>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </Form>
  );
}
