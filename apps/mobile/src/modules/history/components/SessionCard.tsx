import { ParkingSessionSummary } from '@parkguard/types';
import * as Haptics from 'expo-haptics';
import { Car, ChevronRight } from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import { formatDateTime } from '@/utils/formatDate';

export default function SessionCard({
  session,
  onClick,
}: {
  session: ParkingSessionSummary;
  onClick: (session: ParkingSessionSummary) => void;
}) {
  const entryTime = formatDateTime(session.entryAt);
  const handleClick = () => {
    onClick(session);
    Haptics.impactAsync();
  };
  return (
    <Pressable onPress={handleClick}>
      <View className="flex-row items-center gap-3 rounded-xl bg-white p-3 border border-brand-border">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
          <Car size={18} color="#525252" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-jetBrainsMono-Medium text-brand-primary">
            {session.vehicle.plateNumber}
          </Text>

          <View className="flex-row items-center">
            <Text className="text-xs text-neutral-500 capitalize pr-2">
              {session.vehicle.model ? session.vehicle.model + ' • ' : ''}
              {session.vehicle.color ? session.vehicle.color : ''}
            </Text>

            {session.vehicle.color && (
              <View
                style={{
                  backgroundColor: session.vehicle.color.toLowerCase(),
                }}
                className="h-2 w-2 rounded-full"
              ></View>
            )}
          </View>
        </View>
        <Text className="text-xs text-brand-primary">
          in {entryTime.day} {entryTime.time}
        </Text>
        <ChevronRight size={16} color="#a3a3a3" />
      </View>
    </Pressable>
  );
}
