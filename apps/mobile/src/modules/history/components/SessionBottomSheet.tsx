import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { ParkingSessionSummary } from '@parkguard/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { LogIn, IdCard, LogOut, Banknote, Camera } from 'lucide-react-native';
import { useMemo, useCallback, forwardRef } from 'react';
import { Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { formatNaira } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';
import { formatDuration } from '@/utils/formatDuration';
import BottomSheetButton from './BottomSheetButton';

type BottomSheetProps = {
  currentSession: ParkingSessionSummary | null;
};
type Ref = BottomSheet;

const SessionBottomSheet = forwardRef<Ref, BottomSheetProps>(({ currentSession }, ref) => {
  const router = useRouter();
  const snapPoints = useMemo(() => ['30%', '50%', '80%'], []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  if (!currentSession) return null;
  const entryAt = formatDateTime(currentSession.entryAt);
  const exitAt = currentSession.exitAt ? formatDateTime(currentSession.entryAt) : null;
  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enablePanDownToClose={true}
      backgroundStyle={{
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
      }}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      onClose={() => Haptics.impactAsync()}
    >
      <BottomSheetView className="p-6 h-full">
        <View className="bg-neutral-200 justify-center border-2 border-brand-primary/20 items-center rounded-2xl gap-4 py-6">
          <Text className="font-jetBrainsMono-Regular text-lg uppercase tracking-wider">
            Plate number
          </Text>
          <Text className="text-5xl pt-1 font-jetBrainsMono-Regular">
            {currentSession.vehicle.plateNumber}
          </Text>
          <Badge
            className={`capitalize px-6 self-center ${currentSession.status === 'active' ? 'bg-green-500' : 'bg-neutral-500'}`}
          >
            <Text className=" text-white capitalize">{currentSession.status}</Text>
          </Badge>
        </View>
        <View className="flex-row justify-between items-center gap-2 mt-8  ">
          <Text className="capitalize text-lg">
            {currentSession.vehicle.model ? currentSession.vehicle.model + ' • ' : ''}
            {currentSession.vehicle.color ? currentSession.vehicle.color : ''}
          </Text>
          {currentSession.durationMinutes && (
            <Text className="text-lg text-brand-primary capitalize font-semibold">
              {formatDuration(currentSession.durationMinutes)}
            </Text>
          )}
        </View>

        <View className="bg-[#F2F4F6] p-6 mb-2 gap-4 rounded-xl">
          <View className="flex-row items-center gap-2">
            <LogIn />
            <View>
              <Text className="uppercase font-jetBrainsMono-Regular">Entry time</Text>
              <Text className="font-semibold text-lg text-brand-navy">
                {entryAt.day}, {entryAt.time}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <IdCard />
            <View>
              <Text className="uppercase font-jetBrainsMono-Regular ">logged in by</Text>
              <Text className="font-semibold text-lg text-brand-navy">
                {currentSession.entryRecordedBy.firstName} {currentSession.entryRecordedBy.lastName}
              </Text>
            </View>
          </View>
          {currentSession.exitAt && (
            <>
              <View className="flex-row items-center gap-2">
                <LogOut />
                <View>
                  <Text className="uppercase font-jetBrainsMono-Regular">Exit time</Text>
                  <Text className="font-semibold text-lg text-brand-navy">
                    {exitAt?.day},{exitAt?.time}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Banknote />
                <View>
                  <Text className="uppercase font-jetBrainsMono-Regular">total amount</Text>
                  <Text className="font-semibold text-lg text-brand-primary">
                    {currentSession.totalAmount ? formatNaira(currentSession.totalAmount) : '₦0.00'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View className="mt-auto gap-4">
          {currentSession.status === 'active' && (
            <Button
              size={'lg'}
              className="rounded-xl  "
              onPress={() => router.push('/(tabs)/capture')}
            >
              <Camera color={'white'} />
              <Text className="text-white capitalize">Capture exit for this vehicle</Text>
            </Button>
          )}
          <BottomSheetButton title="Close Details" />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

SessionBottomSheet.displayName = 'SessionBottomSheet';

export default SessionBottomSheet;
