import BottomSheet from '@gorhom/bottom-sheet';
import { ParkingSessionSummary } from '@parkguard/types';
import { useRouter } from 'expo-router';
import { Camera, MapPin, User } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, buttonTextVariants } from '@/components/Button';
import { useAuth } from '@/modules/auth/context/auth-context';
import { useListSession } from '@/modules/history/api/listSessions';
import SessionBottomSheet from '@/modules/history/components/SessionBottomSheet';
import SessionCard from '@/modules/history/components/SessionCard';
import { getGreeting } from '@/utils/getGreeting';
import { useAttendantSessionAnalytics } from '../api/getAttendantSessionAnalytics';

export function DashboardScreen() {
  const { user, branches } = useAuth();
  const date = new Date();
  const {
    data: analytics,
    isLoading: analyticsFetching,
    refetch: analyticsOnfetch,
  } = useAttendantSessionAnalytics({
    date: date.toISOString().split('T')[0],
    userId: user ? user.id : '',
  });
  const branchId = branches[0]?.branchId || '';
  const [currentSession, setCurrentSession] = useState<ParkingSessionSummary | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const {
    data,
    refetch: sessionsOnRefetch,
    isLoading: sessionsRefetching,
  } = useListSession({
    branchId,
    limit: 10,
    status: 'active',
  });
  const greeting = getGreeting();
  const router = useRouter();
  const handleOpenButtonSheet = (session: ParkingSessionSummary) => {
    setCurrentSession(session);
    bottomSheetRef.current?.snapToIndex(3);
  };

  const sessions = data?.sessions;
  const isRefetching = analyticsFetching || sessionsRefetching;
  const refetch = () => {
    sessionsOnRefetch();
    analyticsOnfetch();
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top', 'left', 'right']}>
      <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
        <View className="gap-3 rounded-b-3xl bg-brand-navy px-6 pb-10 pt-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <User size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {greeting}, {user?.firstName}
              </Text>
              <View className="mt-0.5 flex-row items-center gap-1">
                <MapPin size={13} color="#a3a3a3" />
                <Text className="text-xs text-neutral-400 capitalize w-full">
                  {branches[0]?.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="-mt-6 gap-4 px-6">
          <View className="gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold tracking-wide text-neutral-500">
                TODAY&apos;s SUMMARY
              </Text>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center gap-1">
                <Text className="text-2xl font-bold text-neutral-900">
                  {analytics?.totalCarsIn !== undefined ? analytics.totalCarsIn : '-'}
                </Text>
                <Text className="text-base text-neutral-500">Cars in</Text>
              </View>
              <View className="items-center gap-1">
                <Text className="text-2xl font-bold text-neutral-900">
                  {analytics?.totalCarsOut !== undefined ? analytics.totalCarsOut : '-'}
                </Text>
                <Text className="text-base text-neutral-500">Cars out</Text>
              </View>
            </View>
          </View>

          <Button
            className="w-full"
            variant="primary"
            size="lg"
            onPress={() => router.push('/(tabs)/capture')}
          >
            <Camera size={18} color="white" />
            <Text className={buttonTextVariants({ variant: 'primary', size: 'lg' })}>Capture</Text>
          </Button>
        </View>

        <View className="p-4">
          <View>
            <View className="gap-3 pb-4 mt-8">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-neutral-900">Currently Parked</Text>
              </View>
            </View>
            {sessions?.length === 0 ? (
              <View className="flex-1 items-center justify-center gap-2">
                <Text className="text-sm text-neutral-400">No active sessions</Text>
              </View>
            ) : (
              <View className="gap-4">
                {sessions?.map((session, index) => (
                  <SessionCard
                    key={index + session.id}
                    onClick={handleOpenButtonSheet}
                    session={session}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <SessionBottomSheet ref={bottomSheetRef} currentSession={currentSession} />
    </SafeAreaView>
  );
}
