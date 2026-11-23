import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginBody } from '@parkguard/schemas';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Input } from '@/components/Input';
import { Routes } from '@/config/routes';
import { useLogin } from '../api/login';
import { LoginBodySchema } from '../schemas';
import { applySession } from '../utils';

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const loginMutation = useLogin();

  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginBody) => {
    const data = await loginMutation.mutateAsync(values);
    applySession(data);
    const redirect = searchParams.get('redirect');
    navigate(redirect ? decodeURIComponent(redirect) : Routes.dashboard, { replace: true });
  };

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
                  type="email"
                  className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5"
                  placeholder="janedoe@example.com"
                  autoComplete="email"
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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link to={Routes.forgotPassword} className="text-sm text-secondary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FormControl>
                  <Input
                    className="h-11 rounded-xl border-outline-variant/80 bg-surface/40 px-3.5 placeholder:text-4xl pr-12"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="........."
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
