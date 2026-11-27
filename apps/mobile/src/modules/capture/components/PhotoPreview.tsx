import type { CameraCapturedPicture } from 'expo-camera';
import { ImageManipulator } from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { RotateCw, SendHorizonal } from 'lucide-react-native';
import { View, Text, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/modules/auth/context/auth-context';
import { useRecognizePlate } from '../api/recognize';
type PhotoPreviewProps = {
  photo: CameraCapturedPicture;
  handleRetake: () => void;
};

const PhotoPreview = ({ photo, handleRetake }: PhotoPreviewProps) => {
  const recognizeMutation = useRecognizePlate();
  const router = useRouter();
  const { branches } = useAuth();
  const branchId = branches[0].branchId;

  if (recognizeMutation.isPending) {
    return (
      <View className="flex-1 items-center justify-center gap-4">
        <Spinner size={50} />
        <Text className="text-white text-lg">Wait while we process the image...</Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (!branchId) {
      Toast.show({ type: 'error', text1: 'Branch is required before capturing' });
      return;
    }

    const rendered = await ImageManipulator.manipulate(photo.uri).renderAsync();

    const manipulatedPhoto = await rendered.saveAsync({
      compress: 0.7,
      // format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    if (!manipulatedPhoto.base64) {
      Toast.show({ type: 'error', text1: 'Failed to process image' });
      return;
    }

    const result = await recognizeMutation.mutateAsync({
      branchId,
      imageBase64: manipulatedPhoto.base64,
      mimeType: 'image/jpeg',
    });
    handleRetake();
    if (!result || !result.plateNumber || !result.confidence || recognizeMutation.isError) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'unable to recognise photo, please input manually.',
      });
      router.push('/(tabs)/capture/manualInput');
      return;
    }

    if (result.matchedSessionId) {
      router.push({
        pathname: '/(tabs)/capture/exit',
        params: { sessionId: result.matchedSessionId, confidence: result.confidence },
      });
    } else {
      router.push({
        pathname: '/(tabs)/capture/entry',
        params: {
          branchId: branchId,
          plateNumber: result.plateNumber,
          confidence: result.confidence,
          photoRef: result.photoRef,
          matchedVehicle: result.matchedVehicle ? JSON.stringify(result.matchedVehicle) : undefined,
        },
      });
    }
  };

  return (
    <View className="flex-1 px-4 w-full gap-3 pt-4">
      <Text className="text-center text-2xl text-white">Verify Capture</Text>
      <View className="h-[80%]">
        <Image className="w-full h-full rounded-2xl" source={{ uri: photo.uri }} />
      </View>
      <View className="flex-row mt-5 gap-4">
        <Button onPress={handleRetake} className="border bg-transparent border-white">
          <RotateCw size={'16'} color={'white'} />
          <Text className="text-white">Retake</Text>
        </Button>
        <Button className="flex-1" onPress={handleSend} disabled={recognizeMutation.isPending}>
          <Text className="text-white">Send</Text>
          <SendHorizonal color={'white'} />
        </Button>
      </View>
    </View>
  );
};

export default PhotoPreview;
