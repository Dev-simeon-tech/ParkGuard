import { LogOut, User } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, buttonTextVariants } from '@/components/Button';
import { getRefreshToken } from '@/lib/api/refresh-token-store';
import { useLogout } from '@/modules/auth/api/logout';
import { useAuth } from '@/modules/auth/context/auth-context';
import { clearSession } from '@/modules/auth/utils';

export function ProfileScreen() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    const refreshToken = await getRefreshToken();
    try {
      await logoutMutation.mutateAsync({ refreshToken });
    } catch (error) {
      void error;
    } finally {
      await clearSession();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-8">
      <View className="items-center gap-3">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <User size={28} color="#525252" />
        </View>
        <View className="items-center gap-0.5">
          <Text className="text-lg font-semibold text-neutral-900">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-sm text-neutral-500">{user?.email}</Text>
        </View>
      </View>

      <View className="mt-10">
        <Button
          variant="outline"
          size="lg"
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut size={18} color="#171717" />
          <Text className={buttonTextVariants({ variant: 'outline', size: 'lg' })}>
            {logoutMutation.isPending ? 'Signing out…' : 'Log out'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
