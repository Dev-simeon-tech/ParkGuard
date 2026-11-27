import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, Camera } from 'lucide-react-native';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { formatNaira } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { formatDuration } from '@/utils/formatDuration';

type SuccessParams = {
  eventType: 'exit' | 'entry';
  entryTime: string;
  exitTime: string;
  duration: string;
  totalAmount: string;
};

export default function SuccessPage() {
  const { eventType, entryTime, exitTime, totalAmount, duration } =
    useLocalSearchParams<SuccessParams>();

  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle={'dark-content'} />
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <View className="w-20 h-20 rounded-full items-center justify-center bg-brand-primary">
          <Check size={40} color={'white'} />
        </View>
        <Text className="capitalize text-2xl font-bold">Vehicle {eventType} confirmed!</Text>
        {eventType === 'exit' && (
          <View className="bg-white p-6 rounded-lg border border-brand-border gap-4 w-full">
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-surface capitalize text-base">entry time</Text>
              <Text className="text-brand-navy font-bold text-base">
                {formatDateTime(entryTime).day}, {formatDateTime(entryTime).time}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-surface capitalize text-base">exit time</Text>
              <Text className="text-brand-navy font-bold text-base">
                {new Date(exitTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-surface capitalize text-base">Duration</Text>
              <Text className="capitalize text-brand-navy font-bold text-base pr-1">
                {formatDuration(parseInt(duration))}
              </Text>
            </View>
            <View className="flex-row justify-between pt-5 border-dashed border-t border-brand-border items-center">
              <Text className="text-brand-surface capitalize text-base">Total amount due</Text>
              <Text className="text-brand-primary font-bold text-base">
                {formatNaira(parseFloat(totalAmount))}
              </Text>
            </View>
          </View>
        )}

        <Button className="w-[80%] mt-10" onPress={() => router.replace('/(tabs)/capture')}>
          <Camera color={'white'} />
          <Text className="text-white">Back to Capture</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
