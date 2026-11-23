import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterBody } from '@parkguard/schemas';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { Routes } from '@/config/routes';
import { useRegister } from '../api/register';
import { RegisterBodySchema } from '../schemas';
import { applySession } from '../utils';

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterBody>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      businessName: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: RegisterBody) => {
    const data = await registerMutation.mutateAsync(values);
    applySession(data);
    navigate(Routes.dashboard, { replace: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                    autoComplete="given-name"
                    placeholder="Jane"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                    autoComplete="family-name"
                    placeholder="Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisation / Business name</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                  autoComplete="organization"
                  placeholder="Your parking business"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                  type="email"
                  autoComplete="email"
                  placeholder="janedon@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234 800 000 0000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5 pr-12 "
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary-container focus-visible:outline-none focus-visible:ring-2 "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-secondary/15"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
}
