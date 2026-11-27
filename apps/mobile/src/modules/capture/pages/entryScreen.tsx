import { useLocalSearchParams, useRouter } from 'expo-router';
import { CarFront, LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, buttonTextVariants } from '@/components/Button';
import { useCreateSession } from '../api/createSession';
import { EntryForm } from '../components/entryForm';

export default function EntryScreen() {
  const createSession = useCreateSession();
  const router = useRouter();
  const [changeInfo, setChangeInfo] = useState(false);
  const { plateNumber, branchId, confidence, photoref, matchedVehicle } = useLocalSearchParams<{
    branchId: string;
    plateNumber: string;
    confidence: string;
    photoref: string;
    matchedVehicle?: string;
  }>();
  const parsedMatchedVehicle = matchedVehicle ? JSON.parse(matchedVehicle) : null;

  const handleSubmit = async () => {
    const session = await createSession.mutateAsync({
      branchId,
      plateNumber,
      confidence: parseFloat(confidence),
    });

    if (session) {
      router.replace({
        pathname: '/(tabs)/capture/success',
        params: {
          eventType: 'entry',
        },
      });
    }
  };

  return (
    <SafeAreaView className="px-4 flex-1">
      {parsedMatchedVehicle && !changeInfo ? (
        <View className="flex-1  gap-6">
          <View className="bg-white shadow-sm border py-6 gap-4 border-brand-border rounded-md items-center justify-center">
            <View className="gap-4 flex-row items-center">
              <Text className="uppercase tracking-wider">PLate number</Text>
            </View>
            <Text className="text-5xl font-semibold">{parsedMatchedVehicle.plateNumber}</Text>
          </View>

          <View className="border p-6 border-brand-border bg-[#EFF4FF]  rounded-md gap-4 flex-row items-center">
            <View className="border bg-[#DCE9FF] rounded-md border-brand-border p-3 ">
              <CarFront size={30} />
            </View>
            <View>
              <Text className="capitalize font-bold text-2xl text-brand-navy">
                {parsedMatchedVehicle.model}
              </Text>
              <Text className="capitalize text-xl">{parsedMatchedVehicle.color}</Text>
            </View>
          </View>
          <Text
            onPress={() => setChangeInfo(true)}
            className="text-center text-base font-medium text-brand-primary underline"
          >
            Edit Vehicle information
          </Text>
          <Button
            variant="primary"
            size="lg"
            disabled={createSession.isPending}
            onPress={handleSubmit}
            className="mt-auto"
          >
            <Text className={buttonTextVariants({ variant: 'primary', size: 'lg' })}>
              {createSession.isPending ? 'Creating Session...' : 'Confirm Entry'}
            </Text>
            <LogIn color={'white'} />
          </Button>
        </View>
      ) : (
        <EntryForm
          plateNumber={plateNumber}
          branchId={branchId}
          confidence={parseFloat(confidence)}
          photoRef={photoref}
        />
      )}
    </SafeAreaView>
  );
}
