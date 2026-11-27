import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginBody } from '@parkguard/schemas';
import { LoginBodySchema } from '@parkguard/schemas';
import { ArrowRight, Eye, EyeOff, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, buttonTextVariants } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useLogin } from '../api/login';
import { applySession } from '../utils';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginBody) => {
    try {
      const session = await loginMutation.mutateAsync(data);
      await applySession(session);
    } catch (error) {
      void error;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="gap-4">
        <View className="gap-1.5">
          <Label>Email</Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="you@company.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                rightElement={<Mail size={18} color="#a3a3a3" />}
              />
            )}
          />
          {errors.email ? (
            <Text className="text-xs text-red-600">{errors.email.message}</Text>
          ) : null}
        </View>

        <View className="gap-1.5">
          <Label>Password / PIN</Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                rightElement={
                  <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                    {showPassword ? (
                      <EyeOff size={18} color="#a3a3a3" />
                    ) : (
                      <Eye size={18} color="#a3a3a3" />
                    )}
                  </Pressable>
                }
              />
            )}
          />
          {errors.password ? (
            <Text className="text-xs text-red-600">{errors.password.message}</Text>
          ) : null}
        </View>

        <Button
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className={buttonTextVariants({ variant: 'primary', size: 'lg' })}>
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </Text>
          {!isSubmitting ? <ArrowRight size={18} color="white" /> : null}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
