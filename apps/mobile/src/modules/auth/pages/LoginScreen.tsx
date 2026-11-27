import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '../components/LoginForm';

export function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="gap-6 px-6 py-8" keyboardShouldPersistTaps="handled">
        <Image source={require('../../../../assets/logo.png')} className="w-30 h-30 self-center" />

        <View className="gap-1 mb-5 mt-7">
          <Text className="text-3xl font-bold text-neutral-900 text-center">Attendant Login</Text>
          <Text className="text-lg text-neutral-500 text-center">
            Enter the credentials provided by your organization
          </Text>
        </View>

        <LoginForm />

        <Text className="text-center text-sm font-medium text-brand-primary">Forgot password?</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
