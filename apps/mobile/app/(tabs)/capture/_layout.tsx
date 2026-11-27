import { Stack } from 'expo-router';

export default function CaptureStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#131b2e' },
        headerTitleStyle: { color: 'white' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="exit"
        options={{ headerBackButtonDisplayMode: 'minimal', headerTitle: 'Confirm Exit' }}
      />
      <Stack.Screen
        name="entry"
        options={{ headerBackButtonDisplayMode: 'minimal', headerTitle: 'Confirm Entry' }}
      />
      <Stack.Screen
        name="manualInput"
        options={{ headerBackButtonDisplayMode: 'minimal', headerTitle: 'Recognize Plate' }}
      />
      <Stack.Screen name="success" options={{ headerShown: false }} />
    </Stack>
  );
}
