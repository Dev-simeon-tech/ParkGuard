import { CameraView, useCameraPermissions, FlashMode, CameraCapturedPicture } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { Flashlight, FlashlightOff } from 'lucide-react-native';
import { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, AppState, Linking } from 'react-native';
import { Button } from '@/components/Button';
import PhotoPreview from './PhotoPreview';

export default function Camera() {
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') getPermission();
    });
    return () => sub.remove();
  }, [getPermission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 w-full justify-center items-center bg-brand-navy p-4">
        <View className="bg-white p-6 rounded-xl justify-center">
          <Text style={styles.message}>We need your permission to show the camera</Text>

          {permission.canAskAgain ? (
            <Button variant={'secondary'} onPress={requestPermission}>
              <Text className="text-blue-500 font-bold">Grant permission</Text>
            </Button>
          ) : (
            <>
              <Text className="mb-4 mt-4 text-center text-red-500">
                Camera access was denied. Enable it in your device settings.
              </Text>
              <Button onPress={() => Linking.openSettings()}>
                <Text className="text-white">Open Settings</Text>
              </Button>
            </>
          )}
        </View>
      </View>
    );
  }

  function toggleFlashlight() {
    setFlashMode((currentMode) => (currentMode === 'off' ? 'on' : 'off'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        exif: false,
        base64: true,
        // skipProcessing: true,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) {
    return <PhotoPreview photo={photo} handleRetake={handleRetakePhoto} />;
  }

  return (
    <View className="w-full flex-1">
      {isFocused && <CameraView ref={cameraRef} style={styles.camera} flash={flashMode} />}
      <View className="absolute bottom-0 w-full h-[20%] justify-center items-center">
        <TouchableOpacity onPress={handleTakePhoto}>
          <View className="border-[3px] border-white justify-center items-center bg-transparent p-1 w-[85px] h-[85px] rounded-full">
            <View className="bg-white w-20 h-20 rounded-full"></View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="absolute right-2 top-10 w-fit rounded-xl backdrop-blur-2xl bg-black/50">
        <TouchableOpacity className="py-5 px-2" onPress={toggleFlashlight}>
          {flashMode === 'on' ? <Flashlight color={'white'} /> : <FlashlightOff color={'white'} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  flashLight: {
    color: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
