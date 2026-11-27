import { router } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../context/auth-context';

export function SplashScreen() {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isLoggedIn ? '/(tabs)' : '/(auth)/login');
    }
  }, [isLoading, isLoggedIn]);

  return (
    <View className="flex-1 items-center justify-center bg-brand-navy">
      <View className="flex-1 items-center justify-center gap-3">
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Shield size={20} color="#0f172a" fill="#0f172a" />
          </View>
          <Text className="text-xl font-bold text-white">ParkGuard</Text>
        </View>
        <Text className="text-xs font-medium tracking-widest text-neutral-400">
          CAPTURE. LOG. SECURE.
        </Text>
      </View>
    </View>
  );
}
