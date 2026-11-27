import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, CarFront, LogOut } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { formatDateTime } from '@/utils/formatDate';
import { useCloseSession } from '../api/closeSession';
import { useGetSession } from '../api/getSession';

export default function ExitScreen() {
  const { sessionId, confidence } = useLocalSearchParams<{
    sessionId: string;
    confidence: string;
  }>();
  const router = useRouter();
  const { data: session, isLoading } = useGetSession(sessionId);
  const closeSession = useCloseSession();

  if (isLoading) {
    return (
      <View className="flex-1">
        <Spinner />
      </View>
    );
  }

  if (!session) return;
  const handleCloseSession = async () => {
    const { session } = await closeSession.mutateAsync({
      input: {
        confidence: parseFloat(confidence),
      },
      sessionId,
    });
    router.replace({
      pathname: '/(tabs)/capture/success',
      params: {
        eventType: 'exit',
        entryTime: session.entryAt,
        exitTime: session.exitAt,
        duration: session.durationMinutes,
        totalAmount: session.totalAmount,
      },
    });
  };
  const entryTime = formatDateTime(session?.entryAt);
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 gap-8 ">
        <View className="bg-white border py-6 gap-4 border-brand-border rounded-md items-center justify-center">
          <View className="gap-4 flex-row items-center">
            <Text className="uppercase tracking-wider font-jetBrainsMono-Regular">
              PLate number
            </Text>
            <Badge className="bg-brand-teal h-6 items-center flex-row justify-center">
              <View className="mr-1 h-4 w-4 rounded-full  bg-brand-primary items-center justify-center">
                <Check color={'white'} size={12} />
              </View>
              <Text className="uppercase leading-4 text-brand-primary text-sm">matched</Text>
            </Badge>
          </View>
          <Text className="text-5xl font-jetBrainsMono-Regular pt-2 ">
            {session?.vehicle.plateNumber}
          </Text>
        </View>

        <View className="border p-6 border-brand-border bg-[#EFF4FF] rounded-md gap-4 flex-row items-center">
          <View className="border bg-[#DCE9FF] rounded-md border-brand-border p-3 ">
            <CarFront size={30} />
          </View>
          <View>
            <Text className="capitalize font-bold text-2xl text-brand-navy">
              {session?.vehicle.model}
            </Text>
            <Text className="capitalize text-xl">{session?.vehicle.color}</Text>
          </View>
        </View>

        <View className="bg-white p-6 rounded-lg border border-brand-border gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-brand-surface capitalize text-base">entry time</Text>
            <Text className="text-brand-navy font-bold text-base">
              {entryTime.day}, {entryTime.time}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-brand-surface capitalize text-base">branch</Text>
            <Text className="capitalize text-brand-navy font-bold text-base w-fit">
              {session.branch.name}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-brand-surface capitalize text-base">Status</Text>
            <Text className="text-brand-primary font-bold text-base">{session.status}</Text>
          </View>
        </View>

        <Button className="mt-auto" onPress={handleCloseSession}>
          <Text className="text-white font-semibold text-lg">Confirm exit</Text>
          <LogOut color={'white'} />
        </Button>
      </View>
    </SafeAreaView>
  );
}
