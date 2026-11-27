import { useRouter } from 'expo-router';
import { Info } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useAuth } from '@/modules/auth/context/auth-context';
import { useRecogniseByPlate } from '@/modules/capture/api/recogniseByPlate';

export default function ManualInput() {
  const [plateNumber, setPlateNumber] = useState('');
  const router = useRouter();
  const { branches } = useAuth();
  const recogniseByPlate = useRecogniseByPlate();

  async function handleSubmit() {
    if (!branches[0].branchId || !plateNumber) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'plate number is required',
        visibilityTime: 6000,
      });
    }
    const result = await recogniseByPlate.mutateAsync({
      branchId: branches[0].branchId,
      plateNumber,
    });

    if (result.matchedSessionId) {
      router.replace({
        pathname: '/(tabs)/capture/exit',
        params: { sessionId: result.matchedSessionId, confidence: 0.0 },
      });
    } else {
      router.replace({
        pathname: '/(tabs)/capture/entry',
        params: {
          branchId: branches[0].branchId,
          plateNumber: result.plateNumber,
          confidence: 0.0,
          matchedVehicle: result.matchedVehicle ? JSON.stringify(result.matchedVehicle) : undefined,
        },
      });
    }
  }
  return (
    <SafeAreaView className="flex-1">
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <View className="px-4 flex-1">
          <View>
            <Label className="text-xl font-jetBrainsMono-Regular">Plate number</Label>
            <Input
              placeholder="Enter Plate number"
              autoCorrect={false}
              autoCapitalize="characters"
              value={plateNumber}
              onChangeText={(e) => setPlateNumber(e)}

              className="h-20 text-3xl border font-jetBrainsMono-Regular border-brand-grey m-0 rounded-md"
            />
          </View>
          <View className="mt-4 gap-4 flex-row bg-white rounded-lg p-4 ">
            <Info color={'orange'} />

            <Text className=" flex-1">
              We are having a problem with recognising the plate number picture, Enter the plate
              number in the input above for recognition.
            </Text>
          </View>
          <Button onPress={handleSubmit} size={'lg'} className="mt-auto">
            <Text className="text-white font-semibold">Submit Plate Number</Text>
          </Button>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
