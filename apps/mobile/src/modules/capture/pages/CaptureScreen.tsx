import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Camera from '../components/Camera';

export function CaptureScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-brand-navy">
      <StatusBar barStyle={'default'} />
      <Camera />
    </SafeAreaView>
  );
}
